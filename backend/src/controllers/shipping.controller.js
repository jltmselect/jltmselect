import Auction from "../models/auction.model.js";
import { purchaseShippingLabel, trackShipment } from "../services/shippingService.js";
import shippo from "../utils/shippo.js";

/**
 * Get shipping rates for an auction
 * Expects sellerAddress, buyerAddress, and parcel in request body
 */
export const getShippingRates = async (req, res) => {
  try {
    const { sellerAddress, buyerAddress, parcel } = req.body;

    // Check if shippo is initialized
    if (!shippo) {
      return res.status(500).json({
        success: false,
        message: "Shipping service is not configured properly",
      });
    }

    // Validate required fields
    if (!sellerAddress || !buyerAddress || !parcel) {
      return res.status(400).json({
        success: false,
        message:
          "Seller address, buyer address, and parcel details are required",
      });
    }

    // Validate parcel has all required dimensions
    if (!parcel.weight || !parcel.length || !parcel.width || !parcel.height) {
      return res.status(400).json({
        success: false,
        message: "Parcel must have weight, length, width, and height",
      });
    }

    // Format seller address for Shippo
    const formattedFromAddress = {
      name: sellerAddress.name || "Seller",
      company: sellerAddress.company || "",
      street1: sellerAddress.street1 || sellerAddress.street || "",
      street2: sellerAddress.street2 || sellerAddress.street2 || "",
      city: sellerAddress.city || "",
      state: sellerAddress.state || "",
      zip: sellerAddress.zip || sellerAddress.postCode || "",
      //   country: getCountryCode(sellerAddress.country || "US"),
      country: sellerAddress.country || "US",
      phone: sellerAddress.phone || "",
      email: sellerAddress.email || "",
    };

    // Format buyer address for Shippo
    const formattedToAddress = {
      name: buyerAddress.name || "Buyer",
      company: buyerAddress.company || "",
      street1: buyerAddress.street1 || buyerAddress.street || "",
      street2: buyerAddress.street2 || buyerAddress.street2 || "",
      city: buyerAddress.city || "",
      state: buyerAddress.state || "",
      zip: buyerAddress.zip || buyerAddress.postCode || "",
      //   country: getCountryCode(buyerAddress.country || "US"),
      country: buyerAddress.country || "US",
      phone: buyerAddress.phone || "",
      email: buyerAddress.email || "",
    };

    // Format parcel for Shippo
    const formattedParcel = {
      length: String(parseFloat(parcel.length).toFixed(2)),
      width: String(parseFloat(parcel.width).toFixed(2)),
      height: String(parseFloat(parcel.height).toFixed(2)),
      distanceUnit: getValidDistanceUnit(parcel.distanceUnit), // ← camelCase
      weight: String(parseFloat(parcel.weight).toFixed(2)),
      massUnit: getValidMassUnit(parcel.massUnit), // ← camelCase
    };

//     console.log("From:", JSON.stringify(formattedFromAddress, null, 2));
// console.log("To:", JSON.stringify(formattedToAddress, null, 2));

    // Create shipment with Shippo
    const shipment = await shippo.shipments.create({
      addressFrom: formattedFromAddress, // ← camelCase
      addressTo: formattedToAddress, // ← camelCase
      parcels: [formattedParcel],
      async: false,
    });

    // Format rates for frontend
    const rates = shipment.rates.map((rate) => ({
      provider: rate.provider,
      providerImage75: rate.provider_image_75 || rate.providerImage75,
      providerImage200: rate.provider_image_200 || rate.providerImage200,
      serviceLevel: rate.servicelevel,
      serviceName: rate.servicelevel?.name,
      amount: parseFloat(rate.amount),
      currency: rate.currency,
      estimatedDays: rate.estimatedDays,
      durationTerms: rate.durationTerms,
      rateId: rate.objectId,
      attributes: rate.attributes || [],
      carrierAccount: rate.carrierAccount,
      test: rate.test,
    }));

    // console.log('Rates from Shippo:', JSON.stringify(shipment.rates, null, 2));

    return res.status(200).json({
      success: true,
      message: "Shipping rates retrieved successfully",
      data: {
        rates: rates,
        shipmentId: shipment.object_id,
      },
    });
  } catch (error) {
    console.error("Shipping rates error:", error);

    // Handle validation errors
    if (error.rawMessage) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipping data",
        error: error.rawMessage,
        details: error.rawValue,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate shipping rates",
    });
  }
};

// Helper function to get valid distance unit
const getValidDistanceUnit = (unit) => {
  const validUnits = ["cm", "in", "ft", "m", "mm", "yd"];
  return validUnits.includes(unit.toLowerCase()) ? unit.toLowerCase() : "in";
};

// Helper function to get valid mass unit
const getValidMassUnit = (unit) => {
  const validUnits = ["g", "kg", "lb", "oz"];
  return validUnits.includes(unit.toLowerCase()) ? unit.toLowerCase() : "lb";
};

export const purchaseLabel = async (req, res) => {
    try {
        const { auctionId, rateId } = req.body;
        const userId = req.user._id;

        // console.log(auctionId);
        // console.log(rateId);

        if (!auctionId || !rateId) {
            return res.status(400).json({
                success: false,
                message: 'Auction ID and Rate ID are required'
            });
        }

        const result = await purchaseShippingLabel(auctionId, rateId, userId);

        return res.status(200).json({
            success: true,
            message: 'Shipping label purchased successfully',
            data: result.data
        });

    } catch (error) {
        console.error('Purchase label error:', error);
        
        if (error.message.includes('Unauthorized')) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to purchase shipping label'
        });
    }
};

export const getTrackingInfo = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const userId = req.user._id;

        const auction = await Auction.findById(auctionId);
        
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: 'Auction not found'
            });
        }

        // Verify user is either winner or seller
        if (auction.winner.toString() !== userId.toString() && 
            auction.seller.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view tracking'
            });
        }

        const tracking = await trackShipment(auctionId);

        return res.status(200).json({
            success: true,
            data: tracking
        });

    } catch (error) {
        console.error('Get tracking error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to get tracking information'
        });
    }
};