import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import UserSubscription from "../models/userSubscription.model.js";
import { StripeService } from "../services/stripeService.js";
import agendaService from "../services/agendaService.js";

/**
 * @desc    Purchase a subscription
 * @route   POST /api/v1/subscriptions/purchase
 * @access  Private
 */
export const purchaseSubscription = async (req, res) => {
    try {
        const { subscriptionId, paymentMethodId } = req.body;
        const userId = req.user._id;

        // Validate subscription exists
        const subscription = await Subscription.findOne({
            _id: subscriptionId,
            isActive: true,
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found",
            });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Calculate end date
        const startDate = new Date();
        let endDate = new Date(startDate);
        const durationValue = subscription.duration.value;
        const durationUnit = subscription.duration.unit;

        switch (durationUnit) {
            case "day":
                endDate.setDate(endDate.getDate() + durationValue);
                break;
            case "week":
                endDate.setDate(endDate.getDate() + durationValue * 7);
                break;
            case "month":
                endDate.setMonth(endDate.getMonth() + durationValue);
                break;
            case "year":
                endDate.setFullYear(endDate.getFullYear() + durationValue);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 1); // Default 1 month
        }

        // Calculate amount in cents for Stripe
        const amountInDollars = subscription.price.amount;

        let paymentIntent = null;
        let paymentMethodToUse = paymentMethodId;

        // If user already has a saved card and no new card provided
        if (!paymentMethodToUse && user.paymentMethodId) {
            paymentMethodToUse = user.paymentMethodId;
        }

        if (!paymentMethodToUse) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required",
            });
        }

        // Ensure user has Stripe customer ID
        if (!user.stripeCustomerId) {
            // Create Stripe customer if not exists
            const customer = await StripeService.createCustomer(
                user.email,
                `${user.firstName} ${user.lastName}`
            );
            user.stripeCustomerId = customer.id;

            // Attach payment method to customer
            await StripeService.attachPaymentMethod(user.stripeCustomerId, paymentMethodToUse);
            await user.save();
        }

        try {
            // Create and charge payment intent
            paymentIntent = await StripeService.createImmediateCharge(
                user.stripeCustomerId,
                paymentMethodToUse,
                amountInDollars,
                `${subscription.title} Subscription - ${durationValue} ${durationUnit}${durationValue > 1 ? 's' : ''}`
            );

            if (paymentIntent.status !== "succeeded") {
                throw new Error("Payment failed");
            }
        } catch (paymentError) {
            console.error("Payment error:", paymentError);
            return res.status(400).json({
                success: false,
                message: `Payment failed: ${paymentError.message}`,
            });
        }

        // Create user subscription record
        const userSubscription = await UserSubscription.create({
            user: userId,
            subscription: subscriptionId,
            title: subscription.title,
            description: subscription.description,
            features: subscription.features,
            duration: subscription.duration,
            price: subscription.price,
            startDate,
            endDate,
            expiresAt: endDate,
            paymentIntentId: paymentIntent.id,
            paymentStatus: "succeeded",
            amountPaid: subscription.price.amount,
            currency: subscription.price.currency,
            status: "active",
        });

        await agendaService.scheduleSubscriptionExpiry(userSubscription._id, userSubscription.expiresAt);

        // If this is the first active subscription or user had none, set isCurrent to true
        const activeSubscriptions = await UserSubscription.find({
            user: userId,
            status: "active",
            expiresAt: { $gt: new Date() },
        });

        if (activeSubscriptions.length === 1) {
            userSubscription.isCurrent = true;
            await userSubscription.save();
        } else {
            // If there are multiple active subscriptions, only the latest should be current
            // Set all others to isCurrent false
            await UserSubscription.updateMany(
                { user: userId, _id: { $ne: userSubscription._id } },
                { isCurrent: false }
            );
        }

        // Update subscription's subscriber count
        await Subscription.findByIdAndUpdate(subscriptionId, {
            $inc: { subscriberCount: 1 },
        });

        res.status(200).json({
            success: true,
            message: "Subscription purchased successfully",
            data: {
                subscription: userSubscription,
                paymentIntent: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    amount: paymentIntent.amount,
                },
            },
        });
    } catch (error) {
        console.error("Purchase subscription error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to purchase subscription",
        });
    }
};

/**
 * @desc    Get user's subscription history
 * @route   GET /api/v1/subscriptions/my-subscriptions
 * @access  Private
 */
export const getUserSubscriptions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, page = 1, limit = 10 } = req.query;

        const filter = { user: userId };
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const subscriptions = await UserSubscription.find(filter)
            .populate("subscription", "title slug tag")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await UserSubscription.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                subscriptions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalSubscriptions: total,
                    hasNextPage: skip + subscriptions.length < total,
                    hasPrevPage: skip > 0,
                },
            },
        });
    } catch (error) {
        console.error("Get user subscriptions error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscriptions",
        });
    }
};

/**
 * @desc    Get user's current active subscription
 * @route   GET /api/v1/subscriptions/active
 * @access  Private
 */

export const getActiveSubscription = async (req, res) => {
    try {
        const userId = req.user._id;

        // First try to get the subscription marked as current
        let activeSubscription = await UserSubscription.findOne({
            user: userId,
            isCurrent: true,
            status: "active"
        }).populate("subscription", "title slug tag");

        // If no subscription marked as current, fall back to any active subscription
        if (!activeSubscription) {
            const now = new Date();
            activeSubscription = await UserSubscription.findOne({
                user: userId,
                status: "active",
                expiresAt: { $gt: now }
            })
                .populate("subscription", "title slug tag")
                .sort({ expiresAt: 1 });
        }

        if (!activeSubscription) {
            return res.status(200).json({
                success: true,
                data: null,
                hasActiveSubscription: false
            });
        }

        const daysRemaining = Math.ceil(
            (new Date(activeSubscription.expiresAt) - new Date()) / (1000 * 60 * 60 * 24)
        );

        res.status(200).json({
            success: true,
            data: {
                ...activeSubscription.toObject(),
                daysRemaining,
                isActive: true
            },
            hasActiveSubscription: true
        });
    } catch (error) {
        console.error("Get active subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch active subscription"
        });
    }
};

/**
 * @desc    Lightweight check if user has active subscription
 * @route   GET /api/v1/subscriptions/check-active
 * @access  Private
 */
export const checkActiveSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        const hasActive = await UserSubscription.hasActiveSubscription(userId);

        res.status(200).json({
            success: true,
            hasActiveSubscription: hasActive,
        });
    } catch (error) {
        console.error("Check active subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check subscription status",
        });
    }
};

/**
 * @desc    Cancel a subscription (mark as cancelled but keep until expiry)
 * @route   PATCH /api/v1/subscriptions/:subscriptionId/cancel
 * @access  Private
 */
export const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const userId = req.user._id;

        const subscription = await UserSubscription.findOne({
            _id: subscriptionId,
            user: userId,
        });

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found",
            });
        }

        if (subscription.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Only active subscriptions can be cancelled",
            });
        }

        subscription.status = "cancelled";
        await subscription.save();

        await agendaService.cancelSubscriptionExpiry(subscriptionId);

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully. You can use it until expiry.",
            data: subscription,
        });
    } catch (error) {
        console.error("Cancel subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel subscription",
        });
    }
};

/**
 * @desc    Set a specific subscription as current active
 * @route   PATCH /api/v1/subscriptions/:subscriptionId/set-current
 * @access  Private
 */
export const setCurrentSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const userId = req.user._id;

        // Find the subscription to activate
        const subscriptionToActivate = await UserSubscription.findOne({
            _id: subscriptionId,
            user: userId
        });

        if (!subscriptionToActivate) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }

        // Check if subscription is expired
        if (subscriptionToActivate.status === "expired") {
            return res.status(400).json({
                success: false,
                message: "Cannot activate expired subscription. Please purchase a new plan."
            });
        }

        // Set all user's subscriptions to isCurrent: false
        await UserSubscription.updateMany(
            { user: userId },
            { isCurrent: false }
        );

        // Set the selected subscription to isCurrent: true
        subscriptionToActivate.isCurrent = true;
        await subscriptionToActivate.save();

        res.status(200).json({
            success: true,
            message: `${subscriptionToActivate.title} is now your active plan`,
            data: {
                subscription: subscriptionToActivate
            }
        });
    } catch (error) {
        console.error("Set current subscription error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to set active subscription"
        });
    }
};

export const getAllUserSubscriptions = async (req, res) => {
    try {
        const subscriptions = await UserSubscription.find({})
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { subscriptions }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Upgrade subscription plan
 * @route   POST /api/v1/subscriptions/upgrade
 * @access  Private
 */
export const upgradeSubscription = async (req, res) => {
    try {
        const { subscriptionId, paymentMethodId } = req.body;
        const userId = req.user._id;

        // Get user's current active subscription
        const currentSubscription = await UserSubscription.findOne({
            user: userId,
            status: "active",
            expiresAt: { $gt: new Date() },
            isCurrent: true
        });

        if (!currentSubscription) {
            return res.status(400).json({
                success: false,
                message: "No active subscription found to upgrade",
            });
        }

        // Get the new subscription plan
        const newPlan = await Subscription.findOne({
            _id: subscriptionId,
            isActive: true,
        });

        if (!newPlan) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan not found",
            });
        }

        // Check if new plan is actually an upgrade (higher duration)
        const currentDurationInDays = getDurationInDays(currentSubscription.duration.value, currentSubscription.duration.unit);
        const newDurationInDays = getDurationInDays(newPlan.duration.value, newPlan.duration.unit);

        // Calculate remaining days in current subscription
        const now = new Date();
        const expiryDate = new Date(currentSubscription.expiresAt);
        const remainingDays = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));

        // Calculate upgrade cost (pro-rated)
        // You're paying for the new plan, and we add the remaining days to the new subscription
        const amountToPay = newPlan.price.amount;

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let paymentMethodToUse = paymentMethodId;
        if (!paymentMethodToUse && user.paymentMethodId) {
            paymentMethodToUse = user.paymentMethodId;
        }

        if (!paymentMethodToUse) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required",
            });
        }

        // Ensure user has Stripe customer ID
        if (!user.stripeCustomerId) {
            const customer = await StripeService.createCustomer(
                user.email,
                `${user.firstName} ${user.lastName}`
            );
            user.stripeCustomerId = customer.id;
            await StripeService.attachPaymentMethod(user.stripeCustomerId, paymentMethodToUse);
            await user.save();
        }

        let paymentIntent = null;
        try {
            paymentIntent = await StripeService.createImmediateCharge(
                user.stripeCustomerId,
                paymentMethodToUse,
                amountToPay,
                `Upgrade to ${newPlan.title} - Added ${remainingDays} days from previous plan`
            );

            if (paymentIntent.status !== "succeeded") {
                throw new Error("Payment failed");
            }
        } catch (paymentError) {
            console.error("Payment error:", paymentError);
            return res.status(400).json({
                success: false,
                message: `Payment failed: ${paymentError.message}`,
            });
        }

        // Calculate new end date (new plan duration + remaining days from current subscription)
        const startDate = new Date();
        let endDate = new Date(startDate);
        const durationValue = newPlan.duration.value;
        const durationUnit = newPlan.duration.unit;

        // Add the new plan duration
        switch (durationUnit) {
            case "day":
                endDate.setDate(endDate.getDate() + durationValue);
                break;
            case "week":
                endDate.setDate(endDate.getDate() + durationValue * 7);
                break;
            case "month":
                endDate.setMonth(endDate.getMonth() + durationValue);
                break;
            case "year":
                endDate.setFullYear(endDate.getFullYear() + durationValue);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 1);
        }

        // Add remaining days from current subscription
        if (remainingDays > 0) {
            endDate.setDate(endDate.getDate() + remainingDays);
        }

        // Create new user subscription record
        const newUserSubscription = await UserSubscription.create({
            user: userId,
            subscription: subscriptionId,
            title: newPlan.title,
            description: newPlan.description,
            features: newPlan.features,
            duration: newPlan.duration,
            price: newPlan.price,
            startDate,
            endDate,
            expiresAt: endDate,
            paymentIntentId: paymentIntent.id,
            paymentStatus: "succeeded",
            amountPaid: amountToPay,
            currency: newPlan.price.currency,
            status: "active",
            isCurrent: true,
            upgradedFrom: currentSubscription._id // Track that this is an upgrade
        });

        await agendaService.scheduleSubscriptionExpiry(newUserSubscription._id, newUserSubscription.expiresAt);

        // Set all other subscriptions as not current
        await UserSubscription.updateMany(
            { user: userId, _id: { $ne: newUserSubscription._id } },
            { isCurrent: false }
        );

        // Mark the old subscription as expired/upgraded
        await UserSubscription.findByIdAndUpdate(currentSubscription._id, {
            status: "expired",
            isCurrent: false
        });

        await agendaService.cancelSubscriptionExpiry(currentSubscription._id);

        // Update new plan's subscriber count
        await Subscription.findByIdAndUpdate(subscriptionId, {
            $inc: { subscriberCount: 1 }
        });

        res.status(200).json({
            success: true,
            message: "Subscription upgraded successfully",
            data: {
                subscription: newUserSubscription,
                previousSubscription: currentSubscription,
                remainingDaysAdded: remainingDays,
                paymentIntent: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    amount: paymentIntent.amount,
                },
            },
        });
    } catch (error) {
        console.error("Upgrade subscription error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upgrade subscription",
        });
    }
};

// Helper function to convert duration to days
function getDurationInDays(value, unit) {
    switch (unit) {
        case "day":
            return value;
        case "week":
            return value * 7;
        case "month":
            return value * 30;
        case "year":
            return value * 365;
        default:
            return value;
    }
}

/**
 * @desc    Check if user can upgrade and get upgrade details
 * @route   GET /api/v1/subscriptions/upgrade/:planId/check
 * @access  Private
 */
export const checkUpgradeEligibility = async (req, res) => {
    try {
        const userId = req.user._id;
        const { planId } = req.params;

        // Get current active subscription
        const currentSubscription = await UserSubscription.findOne({
            user: userId,
            status: "active",
            expiresAt: { $gt: new Date() },
            isCurrent: true
        });

        if (!currentSubscription) {
            return res.status(400).json({
                success: false,
                message: "No active subscription found",
                eligible: false
            });
        }

        // Get the new plan
        const newPlan = await Subscription.findOne({
            _id: planId,
            isActive: true
        });

        if (!newPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
                eligible: false
            });
        }

        // Calculate remaining days
        const now = new Date();
        const expiryDate = new Date(currentSubscription.expiresAt);
        const remainingDays = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));

        // Check if it's actually an upgrade (higher duration)
        const currentDays = getDurationInDays(currentSubscription.duration.value, currentSubscription.duration.unit);
        const newDays = getDurationInDays(newPlan.duration.value, newPlan.duration.unit);

        const eligible = newDays > currentDays;

        res.status(200).json({
            success: true,
            data: {
                eligible,
                currentPlan: {
                    title: currentSubscription.title,
                    duration: `${currentSubscription.duration.value} ${currentSubscription.duration.unit}`,
                    expiresAt: currentSubscription.expiresAt
                },
                newPlan: {
                    title: newPlan.title,
                    duration: `${newPlan.duration.value} ${newPlan.duration.unit}`,
                    price: newPlan.price
                },
                remainingDays,
                willGetExtraDays: remainingDays
            }
        });
    } catch (error) {
        console.error("Check upgrade eligibility error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check upgrade eligibility",
        });
    }
};

/**
 * @desc    Renew current subscription (same plan, add remaining days)
 * @route   POST /api/v1/user-subscription/renew
 * @access  Private
 */
export const renewSubscription = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find the subscription to renew (active first, else most recent expired)
        const now = new Date();
        let oldSubscription = await UserSubscription.findOne({
            user: userId,
            status: "active",
            expiresAt: { $gt: now },
            isCurrent: true
        }).populate("subscription");

        if (!oldSubscription) {
            // Fallback to most recent expired subscription
            oldSubscription = await UserSubscription.findOne({
                user: userId,
                status: "expired"
            })
                .populate("subscription")
                .sort({ createdAt: -1 });
        }

        if (!oldSubscription) {
            return res.status(404).json({
                success: false,
                message: "No subscription found to renew. Please purchase a new plan."
            });
        }

        // 2. Get the plan details (the actual Subscription document)
        const plan = oldSubscription.subscription;
        if (!plan || !plan.isActive) {
            return res.status(400).json({
                success: false,
                message: "The subscription plan is no longer available."
            });
        }

        // 3. Get user & payment method
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        let paymentMethodToUse = user.paymentMethodId;
        if (!paymentMethodToUse) {
            return res.status(400).json({
                success: false,
                message: "No saved payment method. Please add a card in your billing settings."
            });
        }

        // 4. Calculate remaining days from the old subscription (if still active)
        let remainingDays = 0;
        if (oldSubscription.status === "active" && new Date(oldSubscription.expiresAt) > now) {
            const diffTime = new Date(oldSubscription.expiresAt) - now;
            remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // 5. Calculate new end date = now + plan duration + remainingDays
        const startDate = new Date();
        let endDate = new Date(startDate);
        const durationValue = plan.duration.value;
        const durationUnit = plan.duration.unit;

        switch (durationUnit) {
            case "day":
                endDate.setDate(endDate.getDate() + durationValue);
                break;
            case "week":
                endDate.setDate(endDate.getDate() + durationValue * 7);
                break;
            case "month":
                endDate.setMonth(endDate.getMonth() + durationValue);
                break;
            case "year":
                endDate.setFullYear(endDate.getFullYear() + durationValue);
                break;
            default:
                endDate.setMonth(endDate.getMonth() + 1);
        }

        if (remainingDays > 0) {
            endDate.setDate(endDate.getDate() + remainingDays);
        }

        // 6. Ensure Stripe customer exists
        if (!user.stripeCustomerId) {
            const customer = await StripeService.createCustomer(
                user.email,
                `${user.firstName} ${user.lastName}`
            );
            user.stripeCustomerId = customer.id;
            await StripeService.attachPaymentMethod(user.stripeCustomerId, paymentMethodToUse);
            await user.save();
        }

        // 7. Process payment
        let paymentIntent;
        try {
            paymentIntent = await StripeService.createImmediateCharge(
                user.stripeCustomerId,
                paymentMethodToUse,
                plan.price.amount,
                `Renewal: ${plan.title} (${durationValue} ${durationUnit}${durationValue > 1 ? 's' : ''})${remainingDays > 0 ? ` + ${remainingDays} days bonus` : ''}`
            );

            if (paymentIntent.status !== "succeeded") {
                throw new Error("Payment failed");
            }
        } catch (paymentError) {
            console.error("Renewal payment error:", paymentError);
            return res.status(400).json({
                success: false,
                message: `Payment failed: ${paymentError.message}`
            });
        }

        // 8. Create new user subscription record
        const newUserSubscription = await UserSubscription.create({
            user: userId,
            subscription: plan._id,
            title: plan.title,
            description: plan.description,
            features: plan.features,
            duration: plan.duration,
            price: plan.price,
            startDate,
            endDate,
            expiresAt: endDate,
            paymentIntentId: paymentIntent.id,
            paymentStatus: "succeeded",
            amountPaid: plan.price.amount,
            currency: plan.price.currency,
            status: "active",
            isCurrent: true,
            upgradedFrom: oldSubscription._id // track renewal source
        });

        await agendaService.scheduleSubscriptionExpiry(newUserSubscription._id, newUserSubscription.expiresAt);

        // 9. Update old subscription: set not current, status to "expired" (or "renewed")
        await UserSubscription.findByIdAndUpdate(oldSubscription._id, {
            isCurrent: false,
            status: "expired" // or we could keep as "renewed" but keep status for history
        });

        await agendaService.cancelSubscriptionExpiry(oldSubscription._id);

        // 10. Update plan subscriber count
        await Subscription.findByIdAndUpdate(plan._id, {
            $inc: { subscriberCount: 1 }
        });

        // 11. Make sure no other subscription is current (just in case)
        await UserSubscription.updateMany(
            { user: userId, _id: { $ne: newUserSubscription._id } },
            { isCurrent: false }
        );

        res.status(200).json({
            success: true,
            message: "Subscription renewed successfully!",
            data: {
                subscription: newUserSubscription,
                remainingDaysAdded: remainingDays,
                paymentIntent: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    amount: paymentIntent.amount
                }
            }
        });

    } catch (error) {
        console.error("Renew subscription error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to renew subscription"
        });
    }
};