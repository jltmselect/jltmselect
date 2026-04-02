// components/SubscriptionModal.jsx
import { useState, useEffect } from "react";
import { X, CreditCard, Star, Check, Zap } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const SubscriptionModal = ({ isOpen, onClose, onSuccess }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [billingInfo, setBillingInfo] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchPlans();
            if (isAuthenticated) {
                fetchBillingInfo();
            }
        }
    }, [isOpen, isAuthenticated]);

    const fetchPlans = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/subscriptions/public/active");
            if (data.success) {
                setPlans(data.data);
            }
        } catch (error) {
            console.error("Fetch plans error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBillingInfo = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/users/billing");
            if (data.success) {
                setBillingInfo(data.data);
            }
        } catch (error) {
            console.error("Fetch billing info error:", error);
        }
    };

    const formatCardDisplay = () => {
        if (!billingInfo?.card) return null;
        const { brand, last4 } = billingInfo.card;
        const brandMap = {
            visa: 'Visa',
            mastercard: 'Mastercard',
            amex: 'American Express',
            discover: 'Discover'
        };
        const displayBrand = brandMap[brand?.toLowerCase()] || brand || 'Card';
        return `${displayBrand} •••• ${last4}`;
    };

    const handlePurchase = async () => {
        if (!selectedPlan) {
            toast.error("Please select a plan");
            return;
        }

        setProcessing(true);
        try {
            const { data } = await axiosInstance.post("/api/v1/user-subscription/purchase", {
                subscriptionId: selectedPlan._id
            });

            if (data.success) {
                toast.success("Subscription activated successfully!");
                onSuccess?.();
                onClose();
                navigate(`/${user?.userType}/subscriptions`);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Purchase failed");
        } finally {
            setProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-bg-primary-light rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-bg-primary-light border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-black dark:text-pure-white">
                        Choose a Plan to Continue
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-text-secondary">Loading plans...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-text-secondary dark:text-text-secondary-dark text-center mb-6">
                                You need an active subscription to view and bid on auctions.
                                Choose a plan below to get started.
                            </p>

                            {/* Saved Card Display */}
                            {billingInfo?.isPaymentVerified && billingInfo?.card && (
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-bg-primary rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={24} className="text-text-secondary" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-black dark:text-pure-white">
                                                Payment Method
                                            </p>
                                            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                                                {formatCardDisplay()}
                                            </p>
                                        </div>
                                        <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                            Saved Card
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-2">
                                        This card will be charged immediately when you purchase a plan
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <div
                                        key={plan._id}
                                        className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                                            selectedPlan?._id === plan._id
                                                ? "border-primary bg-primary/5 ring-2 ring-primary"
                                                : "border-gray-200 dark:border-gray-700 hover:border-primary/50"
                                        }`}
                                        onClick={() => setSelectedPlan(plan)}
                                    >
                                        {plan.isPopular && (
                                            <div className="absolute -top-3 right-4">
                                                <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                    Popular
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="text-center">
                                            <h4 className="text-xl font-bold text-black dark:text-pure-white">
                                                {plan.title}
                                            </h4>
                                            <div className="mt-4">
                                                <span className="text-3xl font-bold text-black dark:text-pure-white">
                                                    ${plan.price.amount}
                                                </span>
                                                <span className="text-text-secondary">
                                                    /{plan.duration.value} {plan.duration.unit}
                                                    {plan.duration.value > 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        <ul className="mt-6 space-y-3">
                                            {plan.features?.slice(0, 4).map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="text-text-secondary">
                                                        {feature.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {selectedPlan?._id === plan._id && (
                                            <div className="absolute bottom-4 right-4">
                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white dark:bg-bg-primary-light border-t border-gray-200 dark:border-gray-700 py-4 px-6">
                    {/* Payment Summary if plan selected */}
                    {selectedPlan && billingInfo?.card && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-bg-primary rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-black dark:text-pure-white">
                                        {selectedPlan.title} Plan
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        {selectedPlan.duration.value} {selectedPlan.duration.unit}{selectedPlan.duration.value > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-black dark:text-pure-white">
                                        ${selectedPlan.price.amount}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        will be charged to {formatCardDisplay()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handlePurchase}
                        disabled={!selectedPlan || processing}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Zap size={18} />
                                {selectedPlan ? (
                                    `Pay $${selectedPlan.price.amount} & Activate ${selectedPlan.title}`
                                ) : (
                                    "Select a Plan to Continue"
                                )}
                            </>
                        )}
                    </button>
                    {selectedPlan && billingInfo?.card && (
                        <p className="text-xs text-text-secondary text-center mt-3">
                            Note: Your saved card {formatCardDisplay()} will be charged immediately
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;