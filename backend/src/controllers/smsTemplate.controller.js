import SmsTemplate from "../models/smsTemplate.model.js";
import SmsCampaign from "../models/smsCampaign.model.js";

// Create template
export const createTemplate = async (req, res) => {
    try {
        const { name, body } = req.body;
        const admin = req.user;

        if (!name || !body) {
            return res.status(400).json({
                success: false,
                message: "Name and body are required",
            });
        }

        // Extract placeholders from body (e.g., {{firstName}})
        const placeholderRegex = /{{([^}]+)}}/g;
        const matches = body.match(placeholderRegex);
        const placeholders = matches ? matches.map(m => m.slice(2, -2).trim()) : [];

        const template = await SmsTemplate.create({
            name: name.trim(),
            body: body.trim(),
            placeholders,
            createdBy: admin._id,
        });

        res.status(201).json({
            success: true,
            message: "SMS template created",
            data: { template },
        });
    } catch (error) {
        console.error("Create SMS template error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create template",
        });
    }
};

// Get all templates (with search & filter)
export const getTemplates = async (req, res) => {
    try {
        const { search, isActive, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { body: { $regex: search, $options: "i" } },
            ];
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const templates = await SmsTemplate.find(filter)
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await SmsTemplate.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: { templates, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), totalItems: total } },
        });
    } catch (error) {
        console.error("Get templates error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch templates",
        });
    }
};

// Get single template
export const getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await SmsTemplate.findById(id).populate("createdBy", "username email");
        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }
        res.status(200).json({ success: true, data: { template } });
    } catch (error) {
        console.error("Get template error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch template" });
    }
};

// Update template
export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, body, isActive } = req.body;

        const template = await SmsTemplate.findById(id);
        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        // Check if template is used in any campaign (sent or scheduled) – optional
        const usedInCampaign = await SmsCampaign.findOne({
            templateId: id,
            status: { $in: ["scheduled", "sending", "sent"] },
        });
        if (usedInCampaign) {
            return res.status(400).json({
                success: false,
                message: "Cannot update template that is already used in active campaigns",
            });
        }

        if (name) template.name = name.trim();
        if (body) {
            template.body = body.trim();
            // Recalculate placeholders
            const placeholderRegex = /{{([^}]+)}}/g;
            const matches = template.body.match(placeholderRegex);
            template.placeholders = matches ? matches.map(m => m.slice(2, -2).trim()) : [];
        }
        if (isActive !== undefined) template.isActive = isActive === "true";

        await template.save();

        res.status(200).json({
            success: true,
            message: "Template updated",
            data: { template },
        });
    } catch (error) {
        console.error("Update template error:", error);
        res.status(500).json({ success: false, message: "Failed to update template" });
    }
};

// Delete template
export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await SmsTemplate.findById(id);
        if (!template) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        // Check if used in any non-draft campaign
        const usedInCampaign = await SmsCampaign.findOne({
            templateId: id,
            status: { $nin: ["draft", "cancelled"] },
        });
        if (usedInCampaign) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete template that is used in active campaigns",
            });
        }

        await template.deleteOne();
        res.status(200).json({ success: true, message: "Template deleted" });
    } catch (error) {
        console.error("Delete template error:", error);
        res.status(500).json({ success: false, message: "Failed to delete template" });
    }
};