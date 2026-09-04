import { model, Schema } from "mongoose";

const smsCampaignSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        templateId: {
            type: Schema.Types.ObjectId,
            ref: "SmsTemplate",
            required: true,
        },
        scheduleDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["draft", "scheduled", "sending", "sent", "failed", "cancelled"],
            default: "draft",
        },
        recipients: {
            type: {
                type: String,
                enum: ["all", "userType", "subscription", "individual", "custom"],
                required: true,
            },
            value: {
                type: Schema.Types.Mixed,
                required: true,
            },
        },
        filters: {
            type: Schema.Types.Mixed,
            default: {},
        },
        stats: {
            total: { type: Number, default: 0 },
            sent: { type: Number, default: 0 },
            failed: { type: Number, default: 0 },
        },
        sentAt: {
            type: Date,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes
smsCampaignSchema.index({ status: 1 });
smsCampaignSchema.index({ scheduleDate: 1 });
smsCampaignSchema.index({ createdBy: 1 });

const SmsCampaign = model("SmsCampaign", smsCampaignSchema);
export default SmsCampaign;