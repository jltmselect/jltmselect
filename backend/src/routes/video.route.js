import express from "express";
import {
    addVideo,
    getVideos,
    getAllVideosAdmin,
    updateVideoStatus,
    deleteVideo,
} from "../controllers/video.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

const videoRouter = express.Router();

// Public routes (for bidders with subscription)
videoRouter.get("/", getVideos);

// Admin routes
videoRouter.post("/add", authAdmin, addVideo);
videoRouter.get("/admin/all", authAdmin, getAllVideosAdmin);
videoRouter.patch("/admin/:id/status", authAdmin, updateVideoStatus);
videoRouter.delete("/admin/:id", authAdmin, deleteVideo);

export default videoRouter;