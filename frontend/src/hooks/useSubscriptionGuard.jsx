import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const useSubscriptionGuard = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
    const [checking, setChecking] = useState(true);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    const checkSubscription = async () => {
        if (!isAuthenticated || !user) {
            setHasActiveSubscription(false);
            setChecking(false);
            return;
        }

        try {
            const { data } = await axiosInstance.get("/api/v1/user-subscription/check-active");
            setHasActiveSubscription(data.hasActiveSubscription);
        } catch (error) {
            console.error("Subscription check error:", error);
            setHasActiveSubscription(false);
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        checkSubscription();
    }, [isAuthenticated, user]);

    const guardAction = (action) => {
        if (!isAuthenticated || !user) {
            toast.error("Please login to view auctions");
            navigate("/login");
            return false;
        }

        if (!hasActiveSubscription) {
            setShowSubscriptionModal(true);
            return false;
        }

        if (action) {
            action();
        }
        return true;
    };

    return {
        hasActiveSubscription,
        checking,
        showSubscriptionModal,
        setShowSubscriptionModal,
        guardAction,
        checkSubscription
    };
};