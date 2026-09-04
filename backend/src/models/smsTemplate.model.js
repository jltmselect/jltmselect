import { model, Schema } from "mongoose";

const smsTemplateSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        body: {
            type: String,
            required: true,
            trim: true,
        },
        placeholders: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
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
// smsTemplateSchema.index({ name: 1 });
smsTemplateSchema.index({ isActive: 1 });

const SmsTemplate = model("SmsTemplate", smsTemplateSchema);
export default SmsTemplate;