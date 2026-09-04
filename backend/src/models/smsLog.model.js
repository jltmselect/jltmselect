import { model, Schema } from "mongoose";

const smsLogSchema = new Schema(
    {
        campaignId: {
            type: Schema.Types.ObjectId,
            ref: "SmsCampaign",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "failed"],
            required: true,
        },
        error: {
            type: String,
            default: null,
        },
        messageSid: {
            type: String,
            default: null,
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

smsLogSchema.index({ campaignId: 1 });
smsLogSchema.index({ userId: 1 });

const SmsLog = model("SmsLog", smsLogSchema);
export default SmsLog;