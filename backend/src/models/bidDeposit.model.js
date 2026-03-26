import { Schema, model } from "mongoose";

const bidDepositSchema = new Schema(
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
    amount: {
      type: Number,
      required: true,
      default: 5, // $5 default deposit
    },
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    depositType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed",
    },
    depositValue: {
      type: Number,
      default: 5, // $5 fixed
    },
    currency: {
      type: String,
      default: "usd",
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
    // Track which bid this deposit was for (first bid)
    firstBidId: {
      type: Schema.Types.ObjectId,
      ref: "Bid",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
bidDepositSchema.index({ auction: 1, bidder: 1 }, { unique: true }); // One deposit per user per auction
// bidDepositSchema.index({ paymentIntentId: 1 });
bidDepositSchema.index({ status: 1 });
bidDepositSchema.index({ bidder: 1, createdAt: -1 });

const BidDeposit = model("BidDeposit", bidDepositSchema);

export default BidDeposit;