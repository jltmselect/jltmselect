// controllers/bidDeposit.controller.js
import BidDeposit from "../models/bidDeposit.model.js";
import Auction from "../models/auction.model.js";
import User from "../models/user.model.js";
import DepositSettings from "../models/depositSettings.model.js";
import { StripeService } from "../services/stripeService.js";

// Create and charge deposit for first bid
export const createBidDeposit = async (req, res) => {
  try {
    const { auctionId, bidAmount, action = "bid" } = req.body; // Make sure action is destructured with default
    const userId = req.user._id;

    // Validate auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Check if auction is active
    if (auction.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Auction is not active",
      });
    }

    // Check if user already paid deposit for this auction
    const existingDeposit = await BidDeposit.findOne({
      auction: auctionId,
      bidder: userId,
      status: "paid",
    });

    if (existingDeposit) {
      return res.status(200).json({
        success: true,
        message: "Deposit already paid",
        data: {
          hasDeposit: true,
          deposit: existingDeposit,
        },
      });
    }

    // Get user with payment info
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId || !user.paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment method not setup. Please add a card in your profile.",
      });
    }

    // Get deposit settings from database
    const depositSettings = await DepositSettings.findOne();

    if (!depositSettings || !depositSettings.isActive) {
      return res.status(400).json({
        success: false,
        message:
          "Deposit system is currently disabled. Please try again later.",
      });
    }

    // Calculate deposit amount based on settings
    let depositAmount;

    if (depositSettings.depositType === "fixed") {
      depositAmount = depositSettings.depositValue;
    } else {
      // Percentage deposit - calculate based on bid amount
      if (!bidAmount) {
        return res.status(400).json({
          success: false,
          message: "Bid amount is required for percentage deposit calculation",
        });
      }

      // Calculate percentage
      let calculatedDeposit =
        (parseFloat(bidAmount) * depositSettings.depositValue) / 100;

      // Apply minimum deposit limit
      if (
        depositSettings.minDepositAmount &&
        calculatedDeposit < depositSettings.minDepositAmount
      ) {
        calculatedDeposit = depositSettings.minDepositAmount;
      }

      // Apply maximum deposit limit (if set)
      if (
        depositSettings.maxDepositAmount &&
        calculatedDeposit > depositSettings.maxDepositAmount
      ) {
        calculatedDeposit = depositSettings.maxDepositAmount;
      }

      depositAmount = calculatedDeposit;
    }

    // Ensure deposit amount is at least $0.50 (Stripe minimum)
    if (depositAmount < 0.5) {
      depositAmount = 0.5;
    }

    // Round to 2 decimal places
    depositAmount = Math.round(depositAmount * 100) / 100;

    // Create and charge deposit immediately
    const paymentIntent = await StripeService.createImmediateCharge(
      user.stripeCustomerId,
      user.paymentMethodId,
      depositAmount,
      `Bid deposit for auction: ${auction.title}`,
    );

    // Check if payment succeeded
    if (paymentIntent.status === "succeeded") {
      // Create deposit record - FIXED: use action variable that was destructured from req.body
      const deposit = await BidDeposit.create({
        auction: auctionId,
        bidder: userId,
        amount: depositAmount,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: "paid",
        paidAt: new Date(),
        depositType: depositSettings.depositType,
        depositValue: depositSettings.depositValue,
        metadata: {
          auctionTitle: auction.title,
          auctionNumber: auction.auctionNumber || "N/A",
          triggeredBy: action, // This was the cause of the error - now it's defined
          originalAmount: bidAmount || "N/A",
          calculationMethod: depositSettings.depositType,
          minDepositApplied: depositSettings.minDepositAmount
            ? depositAmount === depositSettings.minDepositAmount
            : false,
          maxDepositApplied: depositSettings.maxDepositAmount
            ? depositAmount === depositSettings.maxDepositAmount
            : false,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Deposit paid successfully",
        data: {
          deposit,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
          },
        },
      });
    } else {
      // Payment failed
      return res.status(400).json({
        success: false,
        message: "Payment failed",
        data: {
          paymentIntentStatus: paymentIntent.status,
        },
      });
    }
  } catch (error) {
    console.error("Create bid deposit error:", error);

    // Handle specific Stripe errors
    if (error.message.includes("Stripe")) {
      return res.status(400).json({
        success: false,
        message: "Payment processing failed: " + error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while processing deposit",
    });
  }
};

// Check if user has paid deposit for an auction
export const checkBidDeposit = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const userId = req.user._id;

    // Check for ANY paid deposit for this auction (bid or offer)
    const deposit = await BidDeposit.findOne({
      auction: auctionId,
      bidder: userId,
      status: "paid",
    });

    // Get deposit settings
    const depositSettings = await DepositSettings.findOne();

    res.status(200).json({
      success: true,
      data: {
        hasDeposit: !!deposit, // True if user has paid ANY deposit for this auction
        deposit: deposit || null,
        settings: depositSettings
          ? {
              depositType: depositSettings.depositType,
              depositValue: depositSettings.depositValue,
              minDepositAmount: depositSettings.minDepositAmount,
              maxDepositAmount: depositSettings.maxDepositAmount,
              isActive: depositSettings.isActive,
            }
          : {
              isActive: false,
            },
      },
    });
  } catch (error) {
    console.error("Check deposit error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking deposit",
    });
  }
};

// Get user's all deposits
export const getUserDeposits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const deposits = await BidDeposit.find({ bidder: userId })
      .populate("auction", "title currentPrice status endDate")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await BidDeposit.countDocuments({ bidder: userId });

    // Get total deposits amount
    const totalAmount = await BidDeposit.aggregate([
      { $match: { bidder: userId, status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        deposits,
        summary: {
          totalDeposits: total,
          totalAmount: totalAmount[0]?.total || 0,
        },
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get user deposits error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching deposits",
    });
  }
};

// Get deposit statistics for admin
export const getDepositStatistics = async (req, res) => {
  try {
    // Only allow admin
    if (req.user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const stats = await BidDeposit.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          avgDeposit: { $avg: "$amount" },
          minDeposit: { $min: "$amount" },
          maxDeposit: { $max: "$amount" },
        },
      },
    ]);

    // Get daily deposits for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyDeposits = await BidDeposit.aggregate([
      {
        $match: {
          status: "paid",
          paidAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
          count: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || {
          totalDeposits: 0,
          totalAmount: 0,
          avgDeposit: 0,
          minDeposit: 0,
          maxDeposit: 0,
        },
        dailyDeposits,
      },
    });
  } catch (error) {
    console.error("Get deposit statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching statistics",
    });
  }
};

// Optional: Webhook handler for failed payments (if needed)
export const handleDepositWebhook = async (event) => {
  try {
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      // Update deposit status to failed
      await BidDeposit.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: "failed" },
      );

      console.log(`Deposit payment failed for PI: ${paymentIntent.id}`);
    }
  } catch (error) {
    console.error("Deposit webhook error:", error);
  }
};
