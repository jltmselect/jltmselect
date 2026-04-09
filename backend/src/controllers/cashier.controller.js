import User from "../models/user.model.js";
import UserSubscription from "../models/userSubscription.model.js";

/**
 * @desc    Get all bidders with active subscription (for cashier)
 * @route   GET /api/v1/cashier/bidders
 * @access  Private (Cashier only)
 */
export const getBiddersWithActiveSubscription = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 100,
            search = "",
        } = req.query;

        // First, find all active subscriptions and populate user
        const now = new Date();
        const activeSubscriptionsQuery = {
            status: "active",
            expiresAt: { $gt: now },
        };

        // Get all active user subscriptions with populated user
        let activeSubscriptions = await UserSubscription.find(activeSubscriptionsQuery)
            .populate({
                path: "user",
                select: "firstName lastName email phone username userType",
                match: { userType: "bidder" } // Only populate if userType is bidder
            })
            .sort({ createdAt: -1 });

        // Filter out subscriptions where user is null (meaning userType wasn't bidder or user deleted)
        let biddersWithActiveSubscription = activeSubscriptions.filter(
            (sub) => sub.user !== null
        );

        // Apply search filter
        if (search && search.trim()) {
            const searchTerm = search.toLowerCase().trim();
            biddersWithActiveSubscription = biddersWithActiveSubscription.filter((sub) => {
                const user = sub.user;
                return (
                    (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
                    (user.lastName && user.lastName.toLowerCase().includes(searchTerm)) ||
                    (user.email && user.email.toLowerCase().includes(searchTerm)) ||
                    (user.phone && user.phone.includes(searchTerm))
                );
            });
        }

        // Calculate total before pagination
        const total = biddersWithActiveSubscription.length;

        // Apply pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const paginatedResults = biddersWithActiveSubscription.slice(skip, skip + parseInt(limit));

        // Format response data
        const formattedData = paginatedResults.map((subscription) => ({
            _id: subscription.user._id,
            subscriptionId: subscription._id,
            firstName: subscription.user.firstName,
            lastName: subscription.user.lastName,
            email: subscription.user.email,
            phone: subscription.user.phone || "Not provided",
            subscriptionTitle: subscription.title,
            subscriptionExpiry: subscription.expiresAt,
            isDiscountAvailed: subscription.isDiscountAvailed || false,
        }));

        res.status(200).json({
            success: true,
            data: {
                bidders: formattedData,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalBidders: total,
                    limit: parseInt(limit),
                    hasNextPage: skip + paginatedResults.length < total,
                    hasPrevPage: skip > 0,
                },
            },
        });
    } catch (error) {
        console.error("Get bidders with active subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching bidders",
        });
    }
};

/**
 * @desc    Toggle discount availed status for a bidder's active subscription
 * @route   PATCH /api/v1/cashier/bidders/:userId/discount
 * @access  Private (Cashier only)
 */
export const toggleDiscountAvailed = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user's active subscription
        const now = new Date();
        const activeSubscription = await UserSubscription.findOne({
            user: userId,
            status: "active",
            expiresAt: { $gt: now },
        });

        if (!activeSubscription) {
            return res.status(404).json({
                success: false,
                message: "No active subscription found for this bidder",
            });
        }

        // Toggle the discount availed status
        activeSubscription.isDiscountAvailed = !activeSubscription.isDiscountAvailed;
        await activeSubscription.save();

        res.status(200).json({
            success: true,
            message: activeSubscription.isDiscountAvailed
                ? "Discount marked as availed"
                : "Discount unmarked",
            data: {
                isDiscountAvailed: activeSubscription.isDiscountAvailed,
            },
        });
    } catch (error) {
        console.error("Toggle discount availed error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating discount status",
        });
    }
};