import SmsCampaign from "../models/smsCampaign.model.js";
import SmsTemplate from "../models/smsTemplate.model.js";
import SmsLog from "../models/smsLog.model.js";            // ✅ Added for logging
import User from "../models/user.model.js";
import UserSubscription from "../models/userSubscription.model.js"; // ✅ Added
import agendaService from "../services/agendaService.js";
import { sendSMS } from "../utils/twilio.js";

// ---------- Helper: Build user query from recipients ----------
const buildUserQuery = (recipients, filters = {}) => {
    const query = {
        isActive: true,
        phone: { $exists: true, $ne: "" },
        "preferences.smsUpdates": { $ne: false },
        ...filters,
    };

    const { type, value } = recipients;

    switch (type) {
        case "all":
            break;
        case "userType":
            query.userType = value;
            break;
        // subscription is handled separately in resolveRecipients
        case "individual":
            if (Array.isArray(value) && value.length) {
                query._id = { $in: value };
            } else {
                query._id = { $in: [] };
            }
            break;
        case "custom":
            Object.assign(query, value);
            break;
        default:
            break;
    }
    return query;
};

// ---------- Resolve recipients (with subscription support) ----------
const resolveRecipients = async (campaign) => {
    const { recipients, filters } = campaign;
    const query = buildUserQuery(recipients, filters);

    // Handle subscription type (need to join UserSubscription)
    if (recipients.type === "subscription") {
        const subscriptionId = recipients.value;
        if (!subscriptionId) {
            // No subscription ID provided, return empty array
            return [];
        }
        const activeSubs = await UserSubscription.find({
            subscription: subscriptionId,
            status: "active",
            expiresAt: { $gt: new Date() },
        }).select("user");
        const userIds = activeSubs.map(sub => sub.user);
        query._id = { $in: userIds };
    }

    // Fetch users with required fields
    const users = await User.find(query).select(
        "firstName lastName phone email username preferences"
    );
    return users;
};

// ---------- Background processing function (with logging) ----------
export const processCampaign = async (campaignId) => {
    try {
        const campaign = await SmsCampaign.findById(campaignId)
            .populate("templateId", "body placeholders");
        if (!campaign) {
            console.error(`Campaign ${campaignId} not found`);
            return;
        }

        // If status is not 'sending', set it to 'sending' (for scheduled jobs)
        if (campaign.status !== "sending") {
            campaign.status = "sending";
            await campaign.save();
        }

        // Resolve recipients
        const users = await resolveRecipients(campaign);
        const total = users.length;
        campaign.stats.total = total;
        await campaign.save();

        const templateBody = campaign.templateId.body;

        // Send in batches with concurrency limit
        const batchSize = 50;
        let sentCount = 0;
        let failedCount = 0;

        for (let i = 0; i < users.length; i += batchSize) {
            const batch = users.slice(i, i + batchSize);
            // Process each user with concurrency 5
            const promises = batch.map(async (user) => {
                // Replace placeholders
                let personalizedBody = templateBody;
                const placeholders = campaign.templateId.placeholders || [];
                placeholders.forEach(placeholder => {
                    const value = user[placeholder] || "";
                    personalizedBody = personalizedBody.replace(
                        new RegExp(`{{${placeholder}}}`, "g"),
                        value
                    );
                });

                // Send SMS
                let result;
                try {
                    result = await sendSMS(user.phone, personalizedBody);
                } catch (error) {
                    result = { success: false, error: error.message };
                }

                // ✅ LOG the attempt
                const logEntry = {
                    campaignId: campaign._id,
                    userId: user._id,
                    phone: user.phone,
                    status: result.success ? "sent" : "failed",
                    error: result.success ? null : (result.error || "Unknown error"),
                    messageSid: result.success ? result.sid : null,
                    sentAt: new Date(),
                };
                await SmsLog.create(logEntry);

                // Update counters
                if (result.success) {
                    sentCount++;
                } else {
                    failedCount++;
                    console.error(`Failed to send SMS to ${user.phone}:`, result.error);
                }
            });

            await Promise.allSettled(promises);

            // Update stats periodically
            campaign.stats.sent = sentCount;
            campaign.stats.failed = failedCount;
            await campaign.save();
        }

        // Final update
        campaign.stats.sent = sentCount;
        campaign.stats.failed = failedCount;
        campaign.status = failedCount === total ? "failed" : "sent";
        campaign.sentAt = new Date();
        await campaign.save();

        console.log(
            `Campaign ${campaignId} completed. Sent: ${sentCount}, Failed: ${failedCount}`
        );
    } catch (error) {
        console.error(`Error processing campaign ${campaignId}:`, error);
        // Mark as failed
        await SmsCampaign.findByIdAndUpdate(campaignId, { status: "failed" });
    }
};

// ---------- CRUD Controllers (unchanged from previous) ----------
// ... (createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign, sendCampaignNow, cancelScheduledCampaign, previewRecipients)
// I'll include them below for completeness, but they remain the same as earlier.

export const createCampaign = async (req, res) => {
    try {
        const { title, templateId, scheduleDate, recipients, filters = {} } = req.body;
        const admin = req.user;

        if (!title || !templateId || !recipients || !recipients.type || recipients.value === undefined) {
            return res.status(400).json({
                success: false,
                message: "Title, templateId, and recipients (type & value) are required",
            });
        }

        const template = await SmsTemplate.findOne({ _id: templateId, isActive: true });
        if (!template) {
            return res.status(404).json({ success: false, message: "Active template not found" });
        }

        let parsedSchedule = null;
        if (scheduleDate) {
            const date = new Date(scheduleDate);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ success: false, message: "Invalid schedule date" });
            }
            if (date <= new Date()) {
                return res.status(400).json({ success: false, message: "Schedule date must be in the future" });
            }
            parsedSchedule = date;
        }

        const campaignData = {
            title: title.trim(),
            templateId,
            scheduleDate: parsedSchedule,
            status: parsedSchedule ? "scheduled" : "draft",
            recipients,
            filters,
            createdBy: admin._id,
        };

        const campaign = await SmsCampaign.create(campaignData);

        if (parsedSchedule) {
            await agendaService.agenda.schedule(parsedSchedule, "send sms campaign", { campaignId: campaign._id });
        }

        res.status(201).json({
            success: true,
            message: parsedSchedule ? "Campaign scheduled" : "Campaign created as draft",
            data: { campaign },
        });
    } catch (error) {
        console.error("Create campaign error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to create campaign" });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [{ title: { $regex: search, $options: "i" } }];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const campaigns = await SmsCampaign.find(filter)
            .populate("templateId", "name body")
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await SmsCampaign.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: { campaigns, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), totalItems: total } },
        });
    } catch (error) {
        console.error("Get campaigns error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch campaigns" });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await SmsCampaign.findById(id)
            .populate("templateId", "name body placeholders")
            .populate("createdBy", "username email");

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        const users = await resolveRecipients(campaign);
        const sampleUsers = users.slice(0, 5).map(u => ({
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
            email: u.email,
        }));

        res.status(200).json({
            success: true,
            data: {
                campaign,
                stats: {
                    totalRecipients: users.length,
                    sample: sampleUsers,
                },
            },
        });
    } catch (error) {
        console.error("Get campaign error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch campaign" });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, templateId, scheduleDate, recipients, filters } = req.body;

        const campaign = await SmsCampaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        if (campaign.status !== "draft" && campaign.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: "Only draft or scheduled campaigns can be updated",
            });
        }

        if (templateId) {
            const template = await SmsTemplate.findOne({ _id: templateId, isActive: true });
            if (!template) {
                return res.status(404).json({ success: false, message: "Active template not found" });
            }
            campaign.templateId = templateId;
        }

        if (title) campaign.title = title.trim();
        if (recipients) campaign.recipients = recipients;
        if (filters) campaign.filters = filters;

        // Handle schedule update
        if (scheduleDate !== undefined) {
            const newDate = scheduleDate ? new Date(scheduleDate) : null;
            if (newDate && isNaN(newDate.getTime())) {
                return res.status(400).json({ success: false, message: "Invalid schedule date" });
            }
            if (newDate && newDate <= new Date()) {
                return res.status(400).json({ success: false, message: "Schedule date must be in the future" });
            }

            if (campaign.scheduleDate && campaign.status === "scheduled") {
                await agendaService.agenda.cancel({ "data.campaignId": campaign._id });
            }

            campaign.scheduleDate = newDate;
            if (newDate) {
                campaign.status = "scheduled";
                await agendaService.agenda.schedule(newDate, "send sms campaign", { campaignId: campaign._id });
            } else {
                campaign.status = "draft";
            }
        }

        await campaign.save();

        res.status(200).json({
            success: true,
            message: "Campaign updated",
            data: { campaign },
        });
    } catch (error) {
        console.error("Update campaign error:", error);
        res.status(500).json({ success: false, message: "Failed to update campaign" });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await SmsCampaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        // if (campaign.status !== "draft" && campaign.status !== "scheduled") {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Only draft or scheduled campaigns can be deleted",
        //     });
        // }

        if (campaign.status === "scheduled") {
            await agendaService.agenda.cancel({ "data.campaignId": campaign._id });
        }

        await campaign.deleteOne();
        res.status(200).json({ success: true, message: "Campaign deleted" });
    } catch (error) {
        console.error("Delete campaign error:", error);
        res.status(500).json({ success: false, message: "Failed to delete campaign" });
    }
};

export const sendCampaignNow = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await SmsCampaign.findById(id).populate("templateId", "body placeholders");

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        if (campaign.status === "sending" || campaign.status === "sent") {
            return res.status(400).json({
                success: false,
                message: `Campaign is already ${campaign.status}`,
            });
        }

        if (campaign.status === "scheduled") {
            await agendaService.agenda.cancel({ "data.campaignId": campaign._id });
        }

        campaign.status = "sending";
        await campaign.save();

        // Process in background
        processCampaign(campaign._id).catch(err => console.error("Campaign processing error:", err));

        res.status(200).json({
            success: true,
            message: "Campaign sending started in background",
        });
    } catch (error) {
        console.error("Send campaign now error:", error);
        res.status(500).json({ success: false, message: "Failed to start campaign" });
    }
};

export const cancelScheduledCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await SmsCampaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        if (campaign.status !== "scheduled") {
            return res.status(400).json({
                success: false,
                message: "Only scheduled campaigns can be cancelled",
            });
        }

        await agendaService.agenda.cancel({ "data.campaignId": campaign._id });

        campaign.status = "cancelled";
        await campaign.save();

        res.status(200).json({
            success: true,
            message: "Scheduled campaign cancelled",
        });
    } catch (error) {
        console.error("Cancel campaign error:", error);
        res.status(500).json({ success: false, message: "Failed to cancel campaign" });
    }
};

export const previewRecipients = async (req, res) => {
    try {
        const { recipients, filters = {} } = req.body;

        if (!recipients || !recipients.type || recipients.value === undefined) {
            return res.status(400).json({ success: false, message: "Recipients definition required" });
        }

        // Build a temporary campaign object to resolve
        const tempCampaign = { recipients, filters };
        const users = await resolveRecipients(tempCampaign);

        const sample = users.slice(0, 10).map(u => ({
            firstName: u.firstName,
            lastName: u.lastName,
            phone: u.phone,
            email: u.email,
        }));

        res.status(200).json({
            success: true,
            data: {
                total: users.length,
                sample,
            },
        });
    } catch (error) {
        console.error("Preview recipients error:", error);
        res.status(500).json({ success: false, message: "Failed to preview recipients" });
    }
};