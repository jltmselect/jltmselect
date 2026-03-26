import DepositSettings from "../models/depositSettings.model.js";

// Get deposit settings
export const getDepositSettings = async (req, res) => {
  try {
    let settings = await DepositSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await DepositSettings.create({
        depositType: "fixed",
        depositValue: 5,
        minDepositAmount: 1,
        maxDepositAmount: null,
        updatedBy: req.user?._id,
      });
    }

    res.status(200).json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    console.error("Get deposit settings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching deposit settings",
    });
  }
};

// Update deposit settings
export const updateDepositSettings = async (req, res) => {
  try {
    const {
      depositType,
      depositValue,
      minDepositAmount,
      maxDepositAmount,
      isActive,
    } = req.body;

    // Validate deposit type
    if (!depositType || !["fixed", "percentage"].includes(depositType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid deposit type. Must be either "fixed" or "percentage"',
      });
    }

    // Validate deposit value
    if (depositValue === undefined || depositValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid deposit value is required",
      });
    }

    // Validate percentage doesn't exceed reasonable limit
    if (depositType === "percentage" && depositValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage deposit cannot exceed 100%",
      });
    }

    // Validate min deposit amount
    if (minDepositAmount !== undefined && minDepositAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Minimum deposit amount must be positive",
      });
    }

    // Validate max deposit amount if provided
    if (maxDepositAmount !== undefined && maxDepositAmount !== null) {
      if (maxDepositAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "Maximum deposit amount must be positive",
        });
      }
      if (minDepositAmount && maxDepositAmount < minDepositAmount) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum deposit amount cannot be less than minimum deposit amount",
        });
      }
    }

    // Find and update the settings (should be only one)
    let settings = await DepositSettings.findOne();

    if (settings) {
      settings.depositType = depositType;
      settings.depositValue = depositValue;
      settings.minDepositAmount = minDepositAmount ?? settings.minDepositAmount;
      settings.maxDepositAmount = maxDepositAmount ?? settings.maxDepositAmount;
      settings.isActive = isActive ?? settings.isActive;
      settings.updatedBy = req.user._id;
      await settings.save();
    } else {
      settings = await DepositSettings.create({
        depositType,
        depositValue,
        minDepositAmount: minDepositAmount || 1,
        maxDepositAmount: maxDepositAmount || null,
        isActive: isActive ?? true,
        updatedBy: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Deposit settings updated successfully",
      data: { settings },
    });
  } catch (error) {
    console.error("Update deposit settings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating deposit settings",
    });
  }
};
