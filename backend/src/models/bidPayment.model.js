import { Schema, model } from "mongoose";

const bidPaymentSchema = new Schema(
  {
    auction: {
      type: Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    bidder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: false,
    },
    clientSecret: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: [
        "created",
        "succeeded",
        "requires_capture",
        "canceled",
        "processing_failed",
        "pending",
      ],
      default: "created",
    },
    chargeAttempted: {
      type: Boolean,
      default: false,
    },
    chargeSucceeded: {
      type: Boolean,
      default: false,
    },
    // Add these fields to your bidPayment schema
    rateId: {
      type: String,
      trim: true,
    },
    rateProvider: {
      type: String,
      trim: true,
    },
    rateServiceLevel: {
      type: String,
      trim: true,
    },
    rateServiceToken: {
      type: String,
      trim: true,
    },
    rateAmount: {
      type: Number,
    },
    rateCurrency: {
      type: String,
      default: "USD",
    },
    rateEstimatedDays: {
      type: Number,
    },
    shippingAmount: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      enum: [
        "bid_authorization",
        "final_commission",
        "bid_deposit",
        "checkout_payment",
        "bank_transfer_payment",
      ],
      default: "bid_authorization",
    },
    commissionRate: {
      type: Number, // Store as decimal: 0.05 for 5%, 0.03 for 3%
      required: false,
    },
    commissionType: {
      type: String,
      enum: ["5%_capped", "3%_uncapped"],
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

bidPaymentSchema.index({ auction: 1, bidder: 1 });
bidPaymentSchema.index({ paymentIntentId: 1 });
bidPaymentSchema.index({ status: 1 });

const BidPayment = model("BidPayment", bidPaymentSchema);

export default BidPayment;
