import User from "../models/user.model.js";
import { StripeService } from "../services/stripeService.js";
import jwt from "jsonwebtoken";
import {
  newUserRegistrationEmail,
  resetPasswordEmail,
  welcomeEmail,
} from "../utils/nodemailer.js";
import crypto from "crypto";
import BidPayment from "../models/bidPayment.model.js";
import {
  uploadDocumentToCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";
import Subscription from "../models/subscription.model.js";
import UserSubscription from "../models/userSubscription.model.js";

// Helper function to generate tokens and set cookies
const generateTokensAndRespond = async (user, req, res, message) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const resetToken = user.generateResetPasswordToken();

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove sensitive data from user object
    const safeUser = user.toSafeObject();

    // await loginUser(req, res);

    // Set cookies and send response
    res
      .status(201)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60 * 1000, // 30 minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json({
        success: true,
        message,
        data: {
          user: safeUser,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

// user.controller.js - Updated registerUser function
export const registerUser = async (req, res) => {
  let createdUser = null; // Track for potential rollback

  try {
    const {
      firstName,
      lastName,
      username,
      referredBy,
      email,
      password,
      userType,
      countryCode,
      countryName,
      phone = "",
      image = "",
      paymentMethodId,
      subscriptionPlanId, // NEW: Plan ID from frontend
      street = "",
      city = "",
      county = "",
      state = "",
      postCode = "",
      country,
      preferences
    } = req.body;

    // Get uploaded file from multer
    const identificationDocumentFile = req.file;

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number is already used",
      });
    }

    // Validate subscription plan exists
    const subscription = await Subscription.findOne({
      _id: subscriptionPlanId,
      isActive: true,
    });

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive subscription plan",
      });
    }

    // Calculate subscription end date
    const startDate = new Date();
    let endDate = new Date(startDate);
    const durationValue = subscription.duration.value;
    const durationUnit = subscription.duration.unit;

    switch (durationUnit) {
      case "day":
        endDate.setDate(endDate.getDate() + durationValue);
        break;
      case "week":
        endDate.setDate(endDate.getDate() + durationValue * 7);
        break;
      case "month":
        endDate.setMonth(endDate.getMonth() + durationValue);
        break;
      case "year":
        endDate.setFullYear(endDate.getFullYear() + durationValue);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

    let stripeCustomerId = null;
    let paymentMethodDetails = null;
    let paymentIntent = null;
    let identificationDocumentUrl = null;
    let identificationDocumentPublicId = null;

    // Handle ID document upload if provided (optional)
    if (identificationDocumentFile) {
      try {
        const isImage = identificationDocumentFile.mimetype.startsWith("image/");
        let uploadResult;
        if (isImage) {
          uploadResult = await uploadImageToCloudinary(
            identificationDocumentFile.buffer,
            "identification-documents",
          );
        } else {
          uploadResult = await uploadDocumentToCloudinary(
            identificationDocumentFile.buffer,
            identificationDocumentFile.originalname,
            "identification-documents",
          );
        }
        identificationDocumentUrl = uploadResult.secure_url;
        identificationDocumentPublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("❌ ID Document upload failed:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload identification document",
        });
      }
    }

    // ============ STEP 1: Create Stripe Customer & Verify Card ============
    try {
      // Create Stripe customer
      const customer = await StripeService.createCustomer(
        email,
        `${firstName} ${lastName}`,
      );
      stripeCustomerId = customer.id;

      // Attach and verify payment method
      const verificationResult = await StripeService.verifyAndSaveCard(
        stripeCustomerId,
        paymentMethodId,
      );

      if (!verificationResult.success) {
        throw new Error("Card verification failed");
      }

      paymentMethodDetails = verificationResult.paymentMethod;

    } catch (stripeError) {
      console.error("Stripe verification error:", stripeError);
      return res.status(400).json({
        success: false,
        message: `Card verification failed: ${stripeError.message}`,
      });
    }

    // ============ STEP 2: Process Subscription Payment ============
    const amountInDollars = subscription.price.amount; // $50

    try {
      paymentIntent = await StripeService.createImmediateCharge(
        stripeCustomerId,
        paymentMethodId,
        amountInDollars,
        `${subscription.title} Subscription - ${durationValue} ${durationUnit}${durationValue > 1 ? 's' : ''}`
      );

      if (paymentIntent.status !== "succeeded") {
        throw new Error(`Payment failed with status: ${paymentIntent.status}`);
      }

    } catch (paymentError) {
      console.error("Payment processing error:", paymentError);
      return res.status(400).json({
        success: false,
        message: `Payment failed: ${paymentError.message}`,
      });
    }

    // ============ STEP 3: Create User in Database ============
    try {
      const userData = {
        firstName,
        lastName,
        username: normalizedUsername,
        referredBy,
        email: normalizedEmail,
        password,
        userType: userType || "bidder",
        countryCode,
        countryName,
        phone,
        image,
        stripeCustomerId,
        isVerified: true,
        identificationDocument: identificationDocumentUrl,
        identificationDocumentPublicId: identificationDocumentPublicId,
        identificationStatus: identificationDocumentUrl ? "pending" : undefined,
        address: {
          street,
          city,
          county,
          state,
          postCode,
          country
        },
        preferences: {
          emailUpdates: preferences,
          smsUpdates: preferences,
        },
        // Payment details
        paymentMethodId: paymentMethodDetails.id,
        cardLast4: paymentMethodDetails.last4,
        cardBrand: paymentMethodDetails.brand,
        cardExpMonth: paymentMethodDetails.expMonth,
        cardExpYear: paymentMethodDetails.expYear,
        isPaymentVerified: true,
      };

      createdUser = await User.create(userData);

      if (!createdUser) {
        throw new Error("User creation failed");
      }

    } catch (userError) {
      console.error("User creation error:", userError);
      // If user creation fails, we should refund the payment
      if (paymentIntent && paymentIntent.id) {
        try {
          await StripeService.refundPayment(paymentIntent.id);
          console.log(`Payment refunded: ${paymentIntent.id}`);
        } catch (refundError) {
          console.error("Failed to refund payment:", refundError);
        }
      }
      return res.status(500).json({
        success: false,
        message: "Failed to create user account. Payment has been refunded.",
      });
    }

    // ============ STEP 4: Create User Subscription Record ============
    try {
      const userSubscription = await UserSubscription.create({
        user: createdUser._id,
        subscription: subscriptionPlanId,
        title: subscription.title,
        description: subscription.description,
        features: subscription.features,
        duration: subscription.duration,
        price: subscription.price,
        startDate,
        endDate,
        expiresAt: endDate,
        paymentIntentId: paymentIntent.id,
        paymentStatus: "succeeded",
        amountPaid: subscription.price.amount,
        currency: subscription.price.currency,
        status: "active",
        isCurrent: true,
      });

      // Update subscription subscriber count
      await Subscription.findByIdAndUpdate(subscriptionPlanId, {
        $inc: { subscriberCount: 1 },
      });

    } catch (subscriptionError) {
      console.error("Subscription creation error:", subscriptionError);
      // If subscription record creation fails, we should delete the user and refund payment
      if (createdUser) {
        await User.findByIdAndDelete(createdUser._id);
        console.log(`User deleted due to subscription creation failure: ${createdUser._id}`);
      }
      if (paymentIntent && paymentIntent.id) {
        try {
          await StripeService.refundPayment(paymentIntent.id);
          console.log(`Payment refunded: ${paymentIntent.id}`);
        } catch (refundError) {
          console.error("Failed to refund payment:", refundError);
        }
      }
      return res.status(500).json({
        success: false,
        message: "Failed to create subscription record. Please contact support.",
      });
    }

    // ============ STEP 5: Generate Tokens and Respond ============
    await generateTokensAndRespond(createdUser, req, res, "Registration successful");

    // Send emails in background (don't await)
    welcomeEmail(createdUser, null).catch(error => console.error("Welcome email error:", error));

    try {
      const adminUsers = await User.find({ userType: "admin" });
      for (const admin of adminUsers) {
        await newUserRegistrationEmail(admin.email, createdUser);
      }
    } catch (emailError) {
      console.error("Admin notification email failed:", emailError);
    }

  } catch (error) {
    console.error("Registration error:", error);

    // Final catch-all error handling
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error during registration",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No user found",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    // await generateTokensAndRespond(user, res, 'Login successful');
    await generateTokensAndRespond(user, req, res, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};

// Logout Controller
export const logoutUser = async (req, res) => {
  try {
    const user = req.user;

    // Clear refresh token from database
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    // Clear cookies
    res.clearCookie("accessToken").clearCookie("refreshToken").json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during token refresh",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = await user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailSent = await resetPasswordEmail(user.email, url);

    if (!emailSent) {
      user.resetPasswordToken = null;
      user.resetPasswordTokenExpiry = null;
      await user.save({ validateBeforeSave: false });
      return res
        .status(500)
        .json({ success: false, message: "Could not send email" });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { newPassword } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(200)
        .json({ success: true, message: "Token is invalid or has expired" });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ success: true, message: "Password updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get user" });
  }
};

// ==================== VERIFY EMAIL ====================

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Verification token is required" });
  }

  // Hash the token from URL to compare with stored hash
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification token",
    });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save();

  // emailVerifiedSuccessEmail(user);

  return res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
};

// ==================== RESEND VERIFICATION EMAIL ====================
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.isEmailVerified) {
    return res
      .status(400)
      .json({ success: false, message: "Email already verified" });
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save();

  // Send new verification email
  await welcomeEmail(user, verificationToken);

  return res
    .status(200)
    .json({ success: true, message: "Verification email resent successfully" });
};

export const getBillingInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "stripeCustomerId paymentMethodId cardLast4 cardBrand cardExpMonth cardExpYear isPaymentVerified userType",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const billingInfo = {
      stripeCustomerId: user.stripeCustomerId,
      isPaymentVerified: user.isPaymentVerified,
      userType: user.userType,
    };

    // Add card details if available
    if (user.cardLast4) {
      billingInfo.card = {
        last4: user.cardLast4,
        brand: user.cardBrand,
        expMonth: user.cardExpMonth,
        expYear: user.cardExpYear,
      };
    }

    res.status(200).json({
      success: true,
      data: billingInfo,
    });
  } catch (error) {
    console.error("Get billing info error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching billing information",
    });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.user._id;

    if (!paymentMethodId) {
      return res.status(400).json({
        success: false,
        message: "Payment method ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: "No Stripe customer found",
      });
    }

    // ✅ STEP 1: Cancel ONLY pending authorizations (requires_capture) on old card
    // DO NOT cancel succeeded payments (already charged commissions)
    const pendingAuthorizations = await BidPayment.find({
      bidder: userId,
      type: "bid_authorization",
      status: "requires_capture", // ONLY this status!
    });

    console.log(
      `🔄 Cancelling ${pendingAuthorizations.length} PENDING authorizations for user ${userId}`,
    );

    let cancelledCount = 0;
    for (const payment of pendingAuthorizations) {
      try {
        await StripeService.cancelPaymentIntent(payment.paymentIntentId);
        payment.status = "canceled";
        await payment.save();
        cancelledCount++;
        console.log(
          `✅ Cancelled PENDING authorization for auction: ${payment.auction}`,
        );
      } catch (error) {
        console.error(
          `❌ Failed to cancel authorization ${payment.paymentIntentId}:`,
          error.message,
        );
      }
    }

    // ✅ STEP 2: Also mark any 'succeeded' bid_authorizations as 'replaced'
    // These are the old $2500 authorizations that were replaced by final commissions
    const succeededAuthorizations = await BidPayment.find({
      bidder: userId,
      type: "bid_authorization",
      status: "succeeded",
    });

    for (const payment of succeededAuthorizations) {
      payment.status = "replaced"; // Mark as replaced for clarity
      await payment.save();
      console.log(
        `📝 Marked succeeded authorization as replaced for auction: ${payment.auction}`,
      );
    }

    // ✅ STEP 3: Verify and update card with Stripe
    const verificationResult = await StripeService.verifyAndSaveCard(
      user.stripeCustomerId,
      paymentMethodId,
    );

    if (!verificationResult.success) {
      throw new Error("Card verification failed");
    }

    const paymentMethodDetails = verificationResult.paymentMethod;

    // ✅ STEP 4: Update user in database
    user.paymentMethodId = paymentMethodDetails.id;
    user.cardLast4 = paymentMethodDetails.last4;
    user.cardBrand = paymentMethodDetails.brand;
    user.cardExpMonth = paymentMethodDetails.expMonth;
    user.cardExpYear = paymentMethodDetails.expYear;
    user.isPaymentVerified = true;

    await user.save();

    const updatedCardInfo = {
      last4: user.cardLast4,
      brand: user.cardBrand,
      expMonth: user.cardExpMonth,
      expYear: user.cardExpYear,
    };

    res.status(200).json({
      success: true,
      message: `Payment method updated successfully. ${cancelledCount} pending authorizations cancelled.`,
      data: {
        card: updatedCardInfo,
        isPaymentVerified: true,
        userType: user.userType,
        stripeCustomerId: user.stripeCustomerId,
        cancelledAuthorizations: cancelledCount,
      },
    });
  } catch (error) {
    console.error("Update payment method error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update payment method",
    });
  }
};

// Upload identification document
export const uploadIdentification = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPG, PNG, and PDF are allowed",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user can upload (only if rejected or not verified)
    if (user.identificationStatus === "verified") {
      return res.status(400).json({
        success: false,
        message: "Your identity is already verified",
      });
    }

    // If user had previous document, delete it from Cloudinary
    if (user.identificationDocumentPublicId) {
      try {
        await deleteFromCloudinary(user.identificationDocumentPublicId, "raw");
      } catch (deleteError) {
        console.error("Failed to delete old document:", deleteError);
        // Continue with upload even if delete fails
      }
    }

    // Upload new document to Cloudinary
    const isImage = file.mimetype.startsWith("image/");
    let uploadResult;

    if (isImage) {
      uploadResult = await uploadImageToCloudinary(
        file.buffer,
        "identification-documents",
      );
    } else {
      uploadResult = await uploadDocumentToCloudinary(
        file.buffer,
        file.originalname,
        "identification-documents",
      );
    }

    // Update user with new document info
    user.identificationDocument = uploadResult.secure_url;
    user.identificationDocumentPublicId = uploadResult.public_id;
    user.identificationStatus = "pending";
    user.identificationRejectionReason = null; // Clear any previous rejection reason
    user.identificationVerifiedAt = null;

    await user.save();

    // Notify admins about new document for verification
    // try {
    //     const adminUsers = await User.find({ userType: 'admin' });
    //     for (const admin of adminUsers) {
    //         await sendAdminNotification({
    //             email: admin.email,
    //             type: 'new_verification',
    //             user: {
    //                 name: `${user.firstName} ${user.lastName}`,
    //                 email: user.email,
    //                 id: user._id
    //             }
    //         });
    //     }
    // } catch (emailError) {
    //     console.error('Failed to notify admins:', emailError);
    // }

    res.status(200).json({
      success: true,
      message: "Identification document uploaded successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error("Upload identification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload identification document",
    });
  }
};

// Get user's verification status
export const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select(
      "identificationDocument identificationStatus identificationVerifiedAt identificationRejectionReason",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: user.identificationStatus || "not_uploaded",
        documentUrl: user.identificationDocument,
        verifiedAt: user.identificationVerifiedAt,
        rejectionReason: user.identificationRejectionReason,
      },
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verification status",
    });
  }
};

// Delete identification document
export const deleteIdentification = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only allow deletion if status is rejected or pending
    if (user.identificationStatus === "verified") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete verified document",
      });
    }

    // Delete from Cloudinary
    if (user.identificationDocumentPublicId) {
      try {
        await deleteFromCloudinary(user.identificationDocumentPublicId, "raw");
      } catch (deleteError) {
        console.error("Failed to delete from Cloudinary:", deleteError);
      }
    }

    // Clear document fields
    user.identificationDocument = null;
    user.identificationDocumentPublicId = null;
    user.identificationStatus = null;
    user.identificationRejectionReason = null;
    user.identificationVerifiedAt = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Identification document deleted successfully",
      data: {
        user: user.toSafeObject(),
      },
    });
  } catch (error) {
    console.error("Delete identification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete identification document",
    });
  }
};

// export const updatePreferences = async (req, res) => {
//   try {
//     const { preferences } = req.body;
//     const userId = req.user._id;

//     if (!preferences) {
//       return res.status(400).json({
//         success: false,
//         message: "Preferences are required",
//       });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     user.preferences = {
//       ...user.preferences,
//       ...preferences,
//     };

//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Preferences updated successfully",
//       data: {
//         preferences: user.preferences,
//       }
//     });
//   } catch (error) {
//     console.error("Update preferences error:", error);
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to update preferences",
//     });
//   }
// };