import express from "express";
import {
    addVideo,
    getVideos,
    getAllVideosAdmin,
    updateVideoStatus,
    deleteVideo,
} from "../controllers/video.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

const videoRouter = express.Router();

// Public routes (for bidders with subscription)
videoRouter.get("/", getVideos);

// Admin routes
videoRouter.post("/add", authAdmin, requirePermission("manage_videos"), addVideo);
videoRouter.get("/admin/all", authAdmin, requirePermission("manage_videos"), getAllVideosAdmin);
videoRouter.patch("/admin/:id/status", authAdmin, requirePermission("manage_videos"), updateVideoStatus);
videoRouter.delete("/admin/:id", authAdmin, requirePermission("manage_videos"), deleteVideo);

export default videoRouter;