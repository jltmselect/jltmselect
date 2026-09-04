import UserSubscription from "../models/userSubscription.model.js";

export const userHasActiveSubscription = async (userId) => {
    if (!userId) return false;
    return await UserSubscription.hasActiveSubscription(userId);
};