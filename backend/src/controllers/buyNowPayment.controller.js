import Stripe from "stripe";
import Auction from "../models/auction.model.js";
import User from "../models/user.model.js";
import BidPayment from "../models/bidPayment.model.js";
import Commission from "../models/commission.model.js";
import {
  sendAuctionWonEmail,
  sendAuctionEndedSellerEmail,
  auctionWonAdminEmail,
  paymentCompletedEmail,
} from "../utils/nodemailer.js";
import { calculateCommission } from "../utils/commissionCalculator.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Process Buy Now payment
export const processBuyNowPayment = async (req, res) => {
  try {
    const { auctionId } = req.body;
    const userId = req.user.id;

    // Find auction
    const auction = await Auction.findById(auctionId).populate(
      "seller",
      "email username firstName lastName",
    );

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Validate user is not the seller
    if (auction.seller._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot buy your own auction",
      });
    }

    // Validate auction can be bought
    if (auction.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Auction is not active. Current status: ${auction.status}`,
      });
    }

    if (auction.winner) {
      return res.status(400).json({
        success: false,
        message: "Auction already has a winner",
      });
    }

    if (!auction.buyNowPrice) {
      return res.status(400).json({
        success: false,
        message: "Buy Now is not available for this auction",
      });
    }

    // Get user's saved card
    const user = await User.findById(userId);
    if (!user.stripeCustomerId || !user.paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "No payment method found. Please add a card to your account.",
      });
    }

    // Calculate total amount (buyNowPrice + commission)
    const buyNowPrice = auction.buyNowPrice;

    // Get commission rate
    const commission = await Commission.findOne();
    let commissionAmount = 0;

    if (commission) {
      if (commission.commissionType === "fixed") {
        commissionAmount = commission.commissionValue;
      } else {
        commissionAmount = (buyNowPrice * commission.commissionValue) / 100;
      }
    }

    const totalAmount = buyNowPrice + commissionAmount;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      customer: user.stripeCustomerId,
      payment_method: user.paymentMethodId,
      description: `Buy Now: ${auction.title}`,
      confirm: true, // Confirm immediately to charge
      off_session: true,
      metadata: {
        auctionId: auctionId,
        userId: userId,
        type: "buy_now_payment",
        buyNowPrice: buyNowPrice.toString(),
        commissionAmount: commissionAmount.toString(),
      },
    });

    // Create payment record
    const bidPayment = await BidPayment.create({
      auction: auctionId,
      bidder: userId,
      bidAmount: buyNowPrice,
      commissionAmount: commissionAmount,
      totalAmount: totalAmount,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      chargeAttempted: true,
      chargeSucceeded: paymentIntent.status === "succeeded",
      type: "final_commission",
      metadata: {
        buyNow: true,
      },
    });

    // If payment succeeded, update auction
    if (paymentIntent.status === "succeeded") {
      // Execute buy now logic
      await auction.buyNow(userId, user.username);

      // Update payment status on auction
      auction.paymentStatus = "completed";
      auction.paymentMethod = "credit_card";
      auction.paymentDate = new Date();
      auction.transactionId = paymentIntent.id;
      await auction.save();

      // Send emails in background
      const populatedAuction = await Auction.findById(auctionId)
        .populate("seller", "username firstName lastName email")
        .populate("winner", "username firstName lastName email phone address");

    //   sendAuctionWonEmail(populatedAuction).catch(console.error);
      paymentCompletedEmail(user, populatedAuction).catch(console.error);
      sendAuctionEndedSellerEmail(populatedAuction).catch(console.error);

      // Notify admins
      const adminUsers = await User.find({ userType: "admin" });
      adminUsers.forEach((admin) => {
        auctionWonAdminEmail(
          admin.email,
          populatedAuction,
          populatedAuction.winner,
        ).catch(console.error);
      });
    }

    return res.status(200).json({
      success: true,
      message:
        paymentIntent.status === "succeeded"
          ? "Payment successful! You have purchased this item."
          : "Payment processing",
      data: {
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          clientSecret: paymentIntent.client_secret,
        },
        auction: {
          id: auction._id,
          title: auction.title,
          paymentStatus: auction.paymentStatus,
        },
      },
    });
  } catch (error) {
    console.error("Buy Now payment error:", error);

    // Handle specific Stripe errors
    if (error.code === "authentication_required") {
      return res.status(402).json({
        success: false,
        message: "This transaction requires authentication. Please try again.",
        requiresAuth: true,
      });
    }

    if (error.code === "card_declined") {
      return res.status(402).json({
        success: false,
        message: "Your card was declined. Please try a different card.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Payment processing failed",
    });
  }
};

// Get buy now payment status
export const getBuyNowPaymentStatus = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const userId = req.user.id;

    const payment = await BidPayment.findOne({
      auction: auctionId,
      bidder: userId,
      "metadata.buyNow": true,
    }).sort({ createdAt: -1 });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "No payment found for this auction",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const claimBuyNowAuction = async (req, res) => {
    try {
        const { auctionId } = req.body;
        const userId = req.user.id;
        const username = req.user.username;

        // Find auction
        const auction = await Auction.findById(auctionId)
            .populate("seller", "email username firstName lastName");

        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found"
            });
        }

        // Validate user is not the seller
        if (auction.seller._id.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "You cannot buy your own auction"
            });
        }

        // Validate auction can be bought
        if (auction.status !== "active") {
            return res.status(400).json({
                success: false,
                message: `Auction is not active. Current status: ${auction.status}`
            });
        }

        if (auction.winner) {
            return res.status(400).json({
                success: false,
                message: "Auction already has a winner"
            });
        }

        if (!auction.buyNowPrice) {
            return res.status(400).json({
                success: false,
                message: "Buy Now is not available for this auction"
            });
        }

        // Get user details
        const user = await User.findById(userId);

        // Check if user has saved card
        const hasSavedCard = !!(user.stripeCustomerId && user.paymentMethodId);

        // Calculate commission
        const buyNowPrice = auction.buyNowPrice;
        const commissionData = await calculateCommission(buyNowPrice);
        const commissionAmount = commissionData.commissionAmount;

        // Update auction directly - mark as sold
        auction.status = "sold";
        auction.winner = userId;
        auction.finalPrice = buyNowPrice;
        auction.currentPrice = buyNowPrice;
        auction.currentBidder = userId;
        auction.endDate = new Date(); // End auction immediately
        auction.paymentStatus = "pending";
        auction.paymentMethod = null;
        auction.commissionAmount = commissionAmount;
        auction.commissionType = commissionData.commissionType;
        auction.commissionValue = commissionData.commissionValue;

        // Reject all pending offers (if any)
        if (auction.offers && auction.offers.length > 0) {
            auction.offers.forEach((offer) => {
                if (offer.status === "pending") {
                    offer.status = "rejected";
                    offer.sellerResponse = "Offer rejected - item sold via Buy Now";
                }
            });
        }

        // Add buy now as a bid record
        auction.bids.push({
            bidder: userId,
            bidderUsername: username,
            amount: buyNowPrice,
            timestamp: new Date(),
            isBuyNow: true
        });

        auction.bidCount += 1;

        await auction.save();

        // Create bid payment record for tracking
        const totalAmount = buyNowPrice + commissionAmount;

        await BidPayment.create({
            auction: auctionId,
            bidder: userId,
            bidAmount: buyNowPrice,
            commissionAmount: commissionAmount,
            totalAmount: totalAmount,
            status: "pending",
            type: "checkout_payment",
            paymentMethod: null,
            metadata: {
                buyNow: true,
                claimedAt: new Date()
            }
        });

        // Return success with auction data for redirect
        return res.status(200).json({
            success: true,
            message: "Auction claimed successfully! Proceed to checkout.",
            data: {
                auctionId: auction._id,
                title: auction.title,
                buyNowPrice: buyNowPrice,
                finalPrice: auction.finalPrice,
                commissionAmount: commissionAmount,
                totalAmount: totalAmount,
                hasSavedCard: hasSavedCard
            }
        });

    } catch (error) {
        console.error("Buy now claim error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to claim auction"
        });
    }
};
