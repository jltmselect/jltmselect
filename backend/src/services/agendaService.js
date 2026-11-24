import Agenda from "agenda";
import Auction from "../models/auction.model.js";
import {
  auctionEndedAdminEmail,
  auctionEndingSoonEmail,
  auctionListedEmail,
  auctionWonAdminEmail,
  sendAuctionEndedSellerEmail,
  sendAuctionWonNotifications,
  sendBulkAuctionNotifications,
  subscriptionAutoRenewalReminderEmail,
  subscriptionRenewalSuccessEmail,
  subscriptionRenewalFailedEmail,
} from "../utils/nodemailer.js";
import User from "../models/user.model.js";
import UserSubscription from "../models/userSubscription.model.js";
import { userHasActiveSubscription } from "../utils/subscriptionHelpers.js";
import { StripeService } from "./stripeService.js";

class AgendaService {
  constructor() {
    this.agenda = new Agenda({
      db: { address: process.env.MONGODB_URI, collection: "agendaJobs" },
      processEvery: "30 seconds", // Check for due jobs every 30 seconds
    });

    this.defineJobs();
  }

  defineJobs() {
    // Job to activate an auction at its start time
    this.agenda.define("activate auction", async (job) => {
      const { auctionId } = job.attrs.data;

      try {
        const auction = await Auction.findById(auctionId);
        if (auction && auction.status === "approved") {
          auction.status = "active";
          await auction.save();
          await auction.populate("seller", "email username firstName preferences userType");

          if (auction.seller.preferences?.emailUpdates) {
            // Send email to seller
            await auctionListedEmail(auction, auction.seller);
          }

          // Get frontend URL from env
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

          // Send bulk notifications to all users (except admin and auction seller)
          const allUsers = await User.find({
            _id: { $ne: auction.seller._id }, // Exclude auction owner
            userType: "bidder", // Only bidder users
            "preferences.emailUpdates": { $ne: false }, // Exclude users who opted out
            "preferences.smsUpdates": { $ne: false }, // Exclude users who opted out
            isActive: true, // Only active users
          }).select("email username firstName phone preferences userType");

          // Send bulk notifications (email + SMS)
          await sendBulkAuctionNotifications(allUsers, auction, auction.seller);

          console.log(`✅ Agenda: Activated auction ${auctionId}`);
        }
      } catch (error) {
        console.error("Agenda job error (activate auction):", error);
        // Job will retry based on Agenda's retry logic
      }
    });

    this.agenda.define("end auction", async (job) => {
      const { auctionId } = job.attrs.data;

      try {
        let auction = await Auction.findById(auctionId).populate(
          "seller",
          "email phone username firstName preferences userType",
        );
        // Don't populate winner initially since it might be null

        if (!auction) {
          console.log(`❌ Agenda: Auction ${auctionId} not found`);
          return;
        }

        // NEW: Skip ending for giveaways - they should only end when claimed
        // Skip ending for always-available auctions (buy_now and giveaway)
        if (
          auction.auctionType === "buy_now" ||
          auction.auctionType === "giveaway"
        ) {
          console.log(
            `🛒 Auction ${auctionId} is ${auction.auctionType} - skipping auto-end (waiting for purchase)`,
          );
          return;
        }

        // Only process if auction is still active and end date has passed
        if (auction.status === "active" && new Date() >= auction.endDate) {
          // CRITICAL CHECK: Skip if auction already has a winner (means offer was accepted or buy now used)
          if (auction.winner) {
            console.log(
              `ℹ️ Agenda: Auction ${auctionId} already has a winner, skipping automated ending`,
            );
            return;
          }

          // CRITICAL CHECK: Skip if auction status is already sold
          const soldStatuses = ["sold", "sold_buy_now"];
          if (soldStatuses.includes(auction.status)) {
            console.log(
              `ℹ️ Agenda: Auction ${auctionId} is already in sold status (${auction.status}), skipping`,
            );
            return;
          }

          // Check if any offer is accepted
          const hasAcceptedOffer =
            auction.offers &&
            auction.offers.some(
              (offer) =>
                offer.status === "accepted" || offer.status === "completed",
            );

          if (hasAcceptedOffer) {
            console.log(
              `ℹ️ Agenda: Auction ${auctionId} has accepted offer, skipping automated ending`,
            );
            return;
          }

          console.log(`✅ Agenda: Ending auction ${auctionId}`);

          // Use the model's endAuction method to handle the business logic
          const result = await auction.endAuction();

          // Re-fetch the auction with populated winner if it was sold
          if (result.wasSold) {
            auction = await Auction.findById(auctionId)
              .populate("seller", "email phone username firstName preferences userType")
              .populate("winner", "email phone username firstName address preferences");
          }

          // Send appropriate emails based on the result
          if (result.wasSold) {
            console.log(
              `✅ Agenda: Auction ${auctionId} was SOLD to ${auction.winner ? auction.winner.username : "unknown"
              }`,
            );

            // Send auction won notifications (email + SMS)
            await sendAuctionWonNotifications(auction);

            // Send admin email for sold auction
            const adminUsers = await User.find({ userType: "admin" });
            for (const admin of adminUsers) {
              await auctionWonAdminEmail(admin.email, auction, auction.winner);
            }

            console.log(`✅ Agenda: Sent SOLD emails for auction ${auctionId}`);
          } else {
            console.log(
              `✅ Agenda: Auction ${auctionId} ended without sale (status: ${result.newStatus})`,
            );

            // Send seller email (auction ended without sale)
            if (auction.seller.preferences?.emailUpdates) {
              await sendAuctionEndedSellerEmail(auction);
            }

            // Send admin email for ended auction
            const adminUsers = await User.find({ userType: "admin" });
            for (const admin of adminUsers) {
              await auctionEndedAdminEmail(admin.email, auction);
            }

            console.log(
              `✅ Agenda: Sent ENDED emails for auction ${auctionId}`,
            );
          }
        } else if (
          auction.status === "active" &&
          new Date() < auction.endDate
        ) {
          // Auction was extended, reschedule the job
          await this.scheduleAuctionEnd(auctionId, auction.endDate);
          console.log(
            `🔄 Agenda: Rescheduled auction ${auctionId} to ${auction.endDate}`,
          );
        } else {
          console.log(
            `ℹ️ Agenda: Auction ${auctionId} status is ${auction.status}, skipping`,
          );
        }
      } catch (error) {
        console.error("Agenda job error (end auction):", error);
      }
    });

    this.agenda.define("send ending soon notifications", async (job) => {
      try {
        const now = new Date();

        // Define multiple time thresholds
        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const twentyFourHoursFromNow = new Date(
          now.getTime() + 24 * 60 * 60 * 1000,
        );

        // Find auctions ending within our thresholds that haven't had notifications sent yet
        const endingSoonAuctions = await Auction.find({
          status: "active",
          $or: [
            {
              // Ending in exactly 30 minutes (±15 minutes window)
              endDate: {
                $lte: thirtyMinutesFromNow,
                $gte: new Date(now.getTime() + 15 * 60 * 1000), // 15 minutes from now
              },
              "notifications.ending30min": { $ne: true }, // Not sent yet
            },
            {
              // Ending in exactly 2 hours (±15 minutes window)
              endDate: {
                $lte: twoHoursFromNow,
                $gte: new Date(now.getTime() + 105 * 60 * 1000), // 1 hour 45 minutes from now
              },
              "notifications.ending2hour": { $ne: true }, // Not sent yet
            },
            {
              // Ending in exactly 24 hours (±15 minutes window)
              endDate: {
                $lte: twentyFourHoursFromNow,
                $gte: new Date(now.getTime() + 1425 * 60 * 1000), // 23 hours 45 minutes from now
              },
              "notifications.ending24hour": { $ne: true }, // Not sent yet
            },
          ],
        }).populate("seller", "email username preferences userType"); // Populate seller to exclude them

        for (const auction of endingSoonAuctions) {
          // Calculate exact time remaining for this auction
          const timeRemaining = auction.endDate - now;
          const minutesRemaining = Math.ceil(timeRemaining / (60 * 1000));

          // Determine which notification threshold this auction falls into
          let notificationType, timeLabel;

          if (minutesRemaining <= 45 && minutesRemaining >= 15) {
            // 30-minute notification window (30 minutes ±15 minutes)
            notificationType = "ending30min";
            timeLabel = "30 minutes";
          } else if (minutesRemaining <= 135 && minutesRemaining >= 105) {
            // 2-hour notification window (2 hours ±15 minutes)
            notificationType = "ending2hour";
            timeLabel = "2 hours";
          } else if (minutesRemaining <= 1455 && minutesRemaining >= 1425) {
            // 24-hour notification window (24 hours ±15 minutes)
            notificationType = "ending24hour";
            timeLabel = "24 hours";
          } else {
            // Skip if not in any precise notification window
            continue;
          }

          // Get unique bidders who have bid on this auction (excluding seller)
          const uniqueBidderIds = [...new Set(auction.bids.map((bid) => bid.bidder.toString()))];

          // Find users who have bid on this auction (excluding seller and opted-out users)
          const previousBidders = await User.find({
            _id: {
              $in: uniqueBidderIds,
              $ne: auction.seller._id // Exclude auction owner
            },
            "preferences.emailUpdates": { $ne: false }, // Exclude users who opted out
            isActive: true, // Only active users
          }).select("email username preferences userType");

          // Send to each previous bidder
          for (const bidder of previousBidders) {
            try {
              if (await userHasActiveSubscription(bidder._id)) {
                await auctionEndingSoonEmail(
                  bidder.email,
                  bidder.username,
                  auction,
                  timeLabel,
                );
              } else {
                console.log(`⏭️ Skipped (no active subscription) ${bidder.email}`);
              }
            } catch (error) {
              console.error(
                `Failed to send ending soon email to previous bidder ${bidder.email}:`,
                error,
              );
            }
          }

          // Mark this notification as sent in the auction document
          await Auction.findByIdAndUpdate(auction._id, {
            $set: {
              [`notifications.${notificationType}`]: true,
              [`notifications.${notificationType}SentAt`]: new Date(),
            },
          });

          console.log(
            `📧 Sent ${timeLabel} notifications for auction "${auction.title}" to ${previousBidders.length} users`,
          );
        }

        console.log(
          `📧 Completed ending soon notifications for ${endingSoonAuctions.length} auctions`,
        );
      } catch (error) {
        console.error("Agenda job error (ending soon notifications):", error);
      }
    });

    this.agenda.define("send sms campaign", async (job) => {
      const { campaignId } = job.attrs.data;
      const { processCampaign } = await import("../controllers/smsCampaign.controller.js");
      await processCampaign(campaignId);
    });

    // Job to send a 2-day-before auto-renewal reminder
    this.agenda.define("send auto-renewal reminder", async (job) => {
      const { userSubscriptionId } = job.attrs.data;

      try {
        const userSubscription = await UserSubscription.findById(userSubscriptionId)
          .populate("user", "email username firstName preferences")
          .populate("subscription", "title price duration isActive");

        if (!userSubscription) {
          console.log(`❌ Agenda: Subscription ${userSubscriptionId} not found for reminder`);
          return;
        }

        if (userSubscription.status !== "active") {
          console.log(`ℹ️ Agenda: Skipping reminder for ${userSubscriptionId} (status: ${userSubscription.status})`);
          return;
        }

        if (userSubscription.autoRenew === false) {
          console.log(`ℹ️ Agenda: Skipping reminder for ${userSubscriptionId} (autoRenew disabled)`);
          return;
        }

        if (new Date() >= userSubscription.expiresAt) {
          console.log(`ℹ️ Agenda: Subscription ${userSubscriptionId} already expired, skipping reminder`);
          return;
        }

        const user = userSubscription.user;
        if (!user?.email) {
          console.log(`❌ Agenda: User missing email for subscription ${userSubscriptionId}`);
          return;
        }

        await subscriptionAutoRenewalReminderEmail(
          user.email,
          user.firstName || user.username || "Member",
          userSubscription
        );

        console.log(`📧 Agenda: Sent auto-renewal reminder for ${userSubscriptionId}`);
      } catch (error) {
        console.error("Agenda job error (send auto-renewal reminder):", error);
      }
    });

    // Job to expire OR auto-renew a subscription at its end date
    this.agenda.define("expire subscription", async (job) => {
      const { userSubscriptionId } = job.attrs.data;
      try {
        const userSubscription = await UserSubscription.findById(userSubscriptionId)
          .populate("user", "email username firstName lastName preferences stripeCustomerId paymentMethodId")
          .populate("subscription", "title description features duration price isActive");

        if (!userSubscription) {
          console.log(`❌ Agenda: Subscription ${userSubscriptionId} not found`);
          return;
        }

        // Only process if still active and past expiry
        if (
          userSubscription.status !== "active" ||
          new Date() < userSubscription.expiresAt
        ) {
          console.log(
            `ℹ️ Agenda: Subscription ${userSubscriptionId} not ready (status: ${userSubscription.status}, expiresAt: ${userSubscription.expiresAt})`
          );
          return;
        }

        const user = userSubscription.user;
        const plan = userSubscription.subscription;

        const expireNow = async (reason) => {
          userSubscription.status = "expired";
          if (userSubscription.isCurrent) userSubscription.isCurrent = false;
          await userSubscription.save();
          console.log(`✅ Agenda: Expired subscription ${userSubscriptionId} — ${reason}`);
        };

        // 1. Auto-renew disabled or cancelled — just expire
        if (userSubscription.autoRenew === false) {
          return await expireNow("auto-renew disabled");
        }

        // 2. Plan no longer exists or is inactive — expire + notify
        if (!plan || plan.isActive === false) {
          await expireNow("plan unavailable");
          if (user?.email) {
            try {
              await subscriptionRenewalFailedEmail(
                user.email,
                user.firstName || user.username || "Member",
                userSubscription,
                "The subscription plan is no longer available. Please purchase a new plan."
              );
            } catch (e) {
              console.error("Renewal failed email error:", e);
            }
          }
          return;
        }

        // 3. No payment method — expire + notify
        if (!user || (!user.paymentMethodId && !user.stripeCustomerId)) {
          await expireNow("no payment method");
          if (user?.email) {
            try {
              await subscriptionRenewalFailedEmail(
                user.email,
                user.firstName || user.username || "Member",
                userSubscription,
                "No saved payment method was found. Please add a card and purchase a new plan."
              );
            } catch (e) {
              console.error("Renewal failed email error:", e);
            }
          }
          return;
        }

        // 4. Attempt charge via Stripe (idempotent per subscription cycle)
        let paymentIntent;
        try {
          let customerId = user.stripeCustomerId;
          if (!customerId) {
            const customer = await StripeService.createCustomer(
              user.email,
              `${user.firstName} ${user.lastName}`
            );
            customerId = customer.id;
            await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
            await StripeService.attachPaymentMethod(customerId, user.paymentMethodId);
          }

          const durationValue = plan.duration.value;
          const durationUnit = plan.duration.unit;

          paymentIntent = await StripeService.createImmediateCharge(
            customerId,
            user.paymentMethodId,
            plan.price.amount,
            `Auto-renewal: ${plan.title} (${durationValue} ${durationUnit}${durationValue > 1 ? "s" : ""})`,
            `autorenew-${userSubscription._id}`
          );

          if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment failed");
          }
        } catch (paymentError) {
          console.error(`❌ Agenda: Auto-renew payment failed for ${userSubscriptionId}:`, paymentError.message);
          await expireNow("payment failed");
          if (user?.email) {
            try {
              await subscriptionRenewalFailedEmail(
                user.email,
                user.firstName || user.username || "Member",
                userSubscription,
                `Payment failed: ${paymentError.message}. Please update your payment method and purchase a new plan.`
              );
            } catch (e) {
              console.error("Renewal failed email error:", e);
            }
          }
          return;
        }

        // 5. Create new subscription record (same plan, same price/duration)
        const startDate = new Date();
        let endDate = new Date(startDate);
        const dv = plan.duration.value;
        const du = plan.duration.unit;
        switch (du) {
          case "day": endDate.setDate(endDate.getDate() + dv); break;
          case "week": endDate.setDate(endDate.getDate() + dv * 7); break;
          case "month": endDate.setMonth(endDate.getMonth() + dv); break;
          case "year": endDate.setFullYear(endDate.getFullYear() + dv); break;
          default: endDate.setMonth(endDate.getMonth() + 1);
        }

        const wasCurrent = userSubscription.isCurrent === true;

        const newUserSubscription = await UserSubscription.create({
          user: user._id,
          subscription: plan._id,
          title: plan.title,
          description: plan.description,
          features: plan.features,
          duration: plan.duration,
          price: plan.price,
          startDate,
          endDate,
          expiresAt: endDate,
          paymentIntentId: paymentIntent.id,
          paymentStatus: "succeeded",
          amountPaid: plan.price.amount,
          currency: plan.price.currency,
          status: "active",
          isCurrent: wasCurrent,
          upgradedFrom: userSubscription._id,
          autoRenew: true,
        });

        // Expire the old record
        userSubscription.status = "expired";
        userSubscription.isCurrent = false;
        await userSubscription.save();

        // Schedule next cycle (expiry + reminder)
        await this.scheduleSubscriptionExpiry(newUserSubscription._id, newUserSubscription.expiresAt);
        await this.scheduleAutoRenewReminder(newUserSubscription._id, newUserSubscription.expiresAt);

        // Notify user
        if (user?.email) {
          try {
            await subscriptionRenewalSuccessEmail(
              user.email,
              user.firstName || user.username || "Member",
              newUserSubscription,
              paymentIntent.id
            );
          } catch (e) {
            console.error("Renewal success email error:", e);
          }
        }

        console.log(`✅ Agenda: Auto-renewed ${userSubscriptionId} → ${newUserSubscription._id}`);
      } catch (error) {
        console.error("Agenda job error (expire subscription / auto-renew):", error);
      }
    });
  }

  // Schedule auction activation job
  async scheduleAuctionActivation(auctionId, startDate) {
    await this.agenda.schedule(startDate, "activate auction", { auctionId });
    // console.log(`📅 Scheduled activation for auction ${auctionId} at ${startDate}`);
  }

  // Schedule auction ending job
  async scheduleAuctionEnd(auctionId, endDate) {
    await this.agenda.schedule(endDate, "end auction", { auctionId });
    // console.log(`📅 Scheduled ending for auction ${auctionId} at ${endDate}`);
  }

  // Cancel jobs if auction is deleted or modified
  async cancelAuctionJobs(auctionId) {
    await this.agenda.cancel({
      "data.auctionId": auctionId,
    });
    console.log(`🗑️ Cancelled jobs for auction ${auctionId}`);
  }

  // Schedule a subscription expiry job
  async scheduleSubscriptionExpiry(userSubscriptionId, expiresAt) {
    await this.agenda.schedule(expiresAt, "expire subscription", { userSubscriptionId });
    console.log(`📅 Scheduled expiry for subscription ${userSubscriptionId} at ${expiresAt}`);
  }

  // Cancel a scheduled expiry job
  async cancelSubscriptionExpiry(userSubscriptionId) {
    await this.agenda.cancel({
      "data.userSubscriptionId": userSubscriptionId,
    });
    console.log(`🗑️ Cancelled expiry job for subscription ${userSubscriptionId}`);
  }

  // Schedule auto-renewal reminder 2 days before expiry (or 1h before if too close)
  async scheduleAutoRenewReminder(userSubscriptionId, expiresAt) {
    const now = new Date();
    const reminderDate = new Date(
      new Date(expiresAt).getTime() - 2 * 24 * 60 * 60 * 1000
    );

    if (reminderDate <= now) {
      const fallback = new Date(new Date(expiresAt).getTime() - 60 * 60 * 1000);
      if (fallback > now) {
        await this.agenda.schedule(fallback, "send auto-renewal reminder", {
          userSubscriptionId: userSubscriptionId.toString(),
        });
        console.log(`📅 Scheduled (late) auto-renewal reminder for ${userSubscriptionId} at ${fallback}`);
        return true;
      }
      console.log(`ℹ️ Skipping reminder for ${userSubscriptionId} — too close to expiry`);
      return false;
    }

    await this.agenda.schedule(reminderDate, "send auto-renewal reminder", {
      userSubscriptionId: userSubscriptionId.toString(),
    });
    console.log(`📅 Scheduled auto-renewal reminder for ${userSubscriptionId} at ${reminderDate}`);
    return true;
  }

  // Cancel a scheduled auto-renewal reminder
  async cancelAutoRenewReminder(userSubscriptionId) {
    await this.agenda.cancel({
      name: "send auto-renewal reminder",
      "data.userSubscriptionId": userSubscriptionId.toString(),
    });
    console.log(`🗑️ Cancelled auto-renewal reminder for ${userSubscriptionId}`);
  }

  // Start Agenda
  async start() {
    await this.agenda.start();
    console.log("🕒 Agenda service started");
    await this.agenda.every("15 minutes", "send ending soon notifications");
  }

  // Graceful shutdown
  async stop() {
    await this.agenda.stop();
    console.log("🛑 Agenda service stopped");
  }
}

export default new AgendaService();
