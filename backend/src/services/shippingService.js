import shippo from "../utils/shippo.js";
import Auction from "../models/auction.model.js";
import User from "../models/user.model.js";
// import { sendShippingConfirmationEmail } from "./email.service.js";

export const purchaseShippingLabel = async (auctionId, rateId, userId) => {
  try {
    // Fetch auction with winner and seller
    const auction = await Auction.findById(auctionId)
      .populate("winner")
      .populate("seller");

    if (!auction) {
      throw new Error("Auction not found");
    }

    // Verify user is the winner
    if (auction.winner._id.toString() !== userId.toString()) {
      throw new Error("Unauthorized to purchase shipping for this auction");
    }

    // Verify payment is completed
    if (auction.paymentStatus !== "completed") {
      throw new Error("Payment must be completed before purchasing shipping");
    }

    // Format recipient address from winner's data
    const winner = auction.winner;
    const recipient = {
      name: `${winner.firstName} ${winner.lastName}`.trim(),
      company: "",
      street1: winner.address?.street || "",
      street2: winner.address?.buildingNameNo || "",
      city: winner.address?.city || "",
      state: winner.address?.state || "",
      zip: winner.address?.postCode || "",
    //   country: winner.address?.country || "US",
      country: winner?.countryCode || "US",
      phone: winner.phone || "",
      email: winner.email || "",
    };

    // Format sender address from seller's data
    const seller = auction.seller;
    const sender = {
      name: `${seller.firstName} ${seller.lastName}`.trim(),
      company: seller.businessName || "",
      street1: seller.address?.street || "",
      street2: seller.address?.buildingNameNo || "",
      city: seller.address?.city || "",
      state: seller.address?.state || "",
      zip: seller.address?.postCode || "",
    //   country: seller.address?.country || "US",
      country: seller?.countryCode || "US",
      phone: seller.phone || "",
      email: seller.email || "",
    };

    // Format parcel from auction data
    const parcel = auction.parcel
      ? {
          length: String(parseFloat(auction.parcel.length).toFixed(2)),
          width: String(parseFloat(auction.parcel.width).toFixed(2)),
          height: String(parseFloat(auction.parcel.height).toFixed(2)),
          distanceUnit: auction.parcel.distanceUnit || "in",
          weight: String(parseFloat(auction.parcel.weight).toFixed(2)),
          massUnit: auction.parcel.massUnit || "lb",
        }
      : null;

    if (!parcel) {
      throw new Error("Parcel details not found for this auction");
    }

    // Purchase the shipping label
    // console.log("Purchasing shipping label with rate:", rateId);

    const transaction = await shippo.transactions.create({
      rate: rateId,
      label_file_type: "PDF",
      async: false,
    });

    // console.log("Transaction response:", JSON.stringify(transaction, null, 2));

    if (transaction.status === "SUCCESS") {
      // Update auction with shipping data
      const updatedAuction = await Auction.findByIdAndUpdate(
        auctionId,
        {
          shipping: {
            rate: {
              objectId: rateId,
              provider: transaction.rate.provider,
              serviceLevel: transaction.rate.servicelevel,
              amount: parseFloat(transaction.rate.amount),
              currency: transaction.rate.currency,
              estimatedDays: transaction.rate.estimated_days,
            },
            transaction: {
              objectId: transaction.object_id,
              status: "PURCHASED",
              labelUrl: transaction.label_url,
              trackingNumber: transaction.tracking_number,
              trackingUrl: transaction.tracking_url_provider,
              commercialInvoiceUrl: transaction.commercial_invoice_url,
              purchasedAt: new Date(),
              messages: transaction.messages || [],
            },
            recipient: recipient,
            metadata: {
              labelPurchasedAt: new Date(),
            },
          },
        },
        { new: true },
      );

      return {
        success: true,
        data: {
          transaction: {
            labelUrl: transaction.label_url,
            trackingNumber: transaction.tracking_number,
            trackingUrl: transaction.tracking_url_provider,
            carrier: transaction.rate.provider,
            service: transaction.rate.servicelevel.name,
            amount: transaction.rate.amount,
          },
          auction: updatedAuction,
        },
      };
    } else {
      // Transaction failed
      await Auction.findByIdAndUpdate(auctionId, {
        "shipping.transaction": {
          status: "FAILED",
          messages: transaction.messages || [],
          purchasedAt: new Date(),
        },
      });

      throw new Error(
        transaction.messages?.[0]?.text || "Failed to purchase shipping label",
      );
    }
  } catch (error) {
    console.error("Shipping label purchase error:", error);
    throw error;
  }
};

export const trackShipment = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId);

    if (!auction || !auction.shipping?.transaction?.trackingNumber) {
      throw new Error("No tracking information found");
    }

    const tracking = await shippo.tracks.get({
      carrier: auction.shipping.rate.provider,
      tracking_number: auction.shipping.transaction.trackingNumber,
    });

    // Update auction with tracking data
    await Auction.findByIdAndUpdate(auctionId, {
      "shipping.tracking": {
        status: tracking.tracking_status?.status || "UNKNOWN",
        statusDetails: tracking.tracking_status?.status_details,
        estimatedDelivery: tracking.eta,
        actualDelivery: tracking.tracking_history?.find(
          (h) => h.status === "DELIVERED",
        )?.status_date,
        trackingHistory: tracking.tracking_history?.map((h) => ({
          status: h.status,
          statusDetails: h.status_details,
          location: h.location,
          timestamp: h.status_date,
        })),
        lastUpdated: new Date(),
      },
    });

    return tracking;
  } catch (error) {
    console.error("Track shipment error:", error);
    throw error;
  }
};
