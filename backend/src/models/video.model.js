import { model, Schema } from "mongoose";

const videoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        youtubeUrl: {
            type: String,
            required: true,
            trim: true,
        },
        youtubeId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        addedByUsername: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better performance
videoSchema.index({ status: 1, createdAt: -1 });
videoSchema.index({ title: "text" });

// Method to extract YouTube ID from URL
videoSchema.statics.extractYouTubeId = function (url) {
    if (!url) return null;

    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }

    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    return match ? match[1] : null;
};

const Video = model("Video", videoSchema);

export default Video;