import { Router } from "express";
import {
  getDepositSettings,
  updateDepositSettings,
} from "../controllers/depositSettings.controller.js";
import { authAdmin } from "../middlewares/auth.middleware.js";

const depositSettingsRouter = Router();

// Get deposit settings (public read might be needed for frontend)
depositSettingsRouter.get("/", getDepositSettings);

// Update deposit settings (admin only)
depositSettingsRouter.put("/", authAdmin, updateDepositSettings);

export default depositSettingsRouter;
