import express from "express";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permission.middleware.js";
import {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
} from "../controllers/smsTemplate.controller.js";
import {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    sendCampaignNow,
    cancelScheduledCampaign,
    previewRecipients,
} from "../controllers/smsCampaign.controller.js";

const smsRouter = express.Router();

// All routes require authentication, admin, and manage_sms permission
smsRouter.use(auth, authAdmin, requirePermission("manage_sms"));

// Templates
smsRouter.post("/templates", createTemplate);
smsRouter.get("/templates", getTemplates);
smsRouter.get("/templates/:id", getTemplateById);
smsRouter.put("/templates/:id", updateTemplate);
smsRouter.delete("/templates/:id", deleteTemplate);

// Campaigns
smsRouter.post("/campaigns", createCampaign);
smsRouter.get("/campaigns", getCampaigns);
smsRouter.get("/campaigns/:id", getCampaignById);
smsRouter.put("/campaigns/:id", updateCampaign);
smsRouter.delete("/campaigns/:id", deleteCampaign);
smsRouter.post("/campaigns/:id/send", sendCampaignNow);
smsRouter.post("/campaigns/:id/cancel", cancelScheduledCampaign);
smsRouter.post("/campaigns/preview-recipients", previewRecipients);

export default smsRouter;