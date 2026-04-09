import Video from "../models/video.model.js";

/**
 * @desc    Add a new video (Admin only)
 * @route   POST /api/v1/videos/add
 * @access  Private (Admin)
 */
export const addVideo = async (req, res) => {
    try {
        const admin = req.user;
        const { title, description, youtubeUrl } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Video title is required",
            });
        }

        if (!youtubeUrl || !youtubeUrl.trim()) {
            return res.status(400).json({
                success: false,
                message: "YouTube URL is required",
            });
        }

        // Extract YouTube ID
        const youtubeId = Video.extractYouTubeId(youtubeUrl);
        if (!youtubeId) {
            return res.status(400).json({
                success: false,
                message: "Invalid YouTube URL. Please enter a valid YouTube video URL.",
            });
        }

        // Create video
        const video = await Video.create({
            title: title.trim(),
            description: description ? description.trim() : "",
            youtubeUrl: youtubeUrl.trim(),
            youtubeId,
            addedBy: admin._id,
            addedByUsername: admin.username,
            status: "active",
        });

        res.status(201).json({
            success: true,
            message: "Video added successfully",
            data: {
                video,
            },
        });
    } catch (error) {
        console.error("Add video error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while adding video",
        });
    }
};

/**
 * @desc    Get all active videos for bidders
 * @route   GET /api/v1/videos
 * @access  Public (but subscription guarded on frontend)
 */
export const getVideos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build filter
        const filter = { status: "active" };

        // Search filter
        if (search && search.trim()) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get videos
        const videos = await Video.find(filter)
            .populate("addedBy", "username firstName lastName")
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Video.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                videos,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalVideos: total,
                    limit: parseInt(limit),
                    hasNextPage: skip + videos.length < total,
                    hasPrevPage: skip > 0,
                },
            },
        });
    } catch (error) {
        console.error("Get videos error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching videos",
        });
    }
};

/**
 * @desc    Get all videos for admin (including inactive)
 * @route   GET /api/v1/admin/videos
 * @access  Private (Admin)
 */
export const getAllVideosAdmin = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            status,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build filter
        const filter = {};

        if (status && status !== "all") {
            filter.status = status;
        }

        // Search filter
        if (search && search.trim()) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get videos
        const videos = await Video.find(filter)
            .populate("addedBy", "username firstName lastName")
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Video.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                videos,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalVideos: total,
                    limit: parseInt(limit),
                    hasNextPage: skip + videos.length < total,
                    hasPrevPage: skip > 0,
                },
            },
        });
    } catch (error) {
        console.error("Get all videos admin error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching videos",
        });
    }
};

/**
 * @desc    Update video status (activate/deactivate)
 * @route   PATCH /api/v1/admin/videos/:id/status
 * @access  Private (Admin)
 */
export const updateVideoStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status (active/inactive) is required",
            });
        }

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        video.status = status;
        await video.save();

        res.status(200).json({
            success: true,
            message: `Video ${status === "active" ? "activated" : "deactivated"} successfully`,
            data: { video },
        });
    } catch (error) {
        console.error("Update video status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while updating video status",
        });
    }
};

/**
 * @desc    Delete video
 * @route   DELETE /api/v1/admin/videos/:id
 * @access  Private (Admin)
 */
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        await video.deleteOne();

        res.status(200).json({
            success: true,
            message: "Video deleted successfully",
        });
    } catch (error) {
        console.error("Delete video error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting video",
        });
    }
};