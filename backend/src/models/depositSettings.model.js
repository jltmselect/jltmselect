import { Schema, model } from 'mongoose';

const depositSettingsSchema = new Schema({
    depositType: {
        type: String,
        enum: ['fixed', 'percentage'],
        required: true,
        default: 'fixed'
    },
    depositValue: { 
        type: Number,
        required: true,
        min: 0,
        default: 5 // $5 default
    },
    description: {
        type: String,
        default: 'Global deposit settings for bid participation'
    },
    // Minimum deposit amount (for percentage calculations)
    minDepositAmount: {
        type: Number,
        default: 1 // Minimum $1 deposit
    },
    // Maximum deposit amount (for percentage calculations, optional)
    maxDepositAmount: {
        type: Number,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Ensure only one deposit settings document exists
depositSettingsSchema.pre('save', async function(next) {
    const count = await this.constructor.countDocuments();
    if (count > 0 && this.isNew) {
        throw new Error('Only one deposit settings configuration can exist');
    }
    next();
});

const DepositSettings = model('DepositSettings', depositSettingsSchema);

export default DepositSettings;