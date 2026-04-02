import { useState, useEffect } from "react";
import { BidderContainer, BidderHeader, BidderSidebar, AuctionCard, AuctionListItem, AccountInactiveBanner } from "../../components";
import { Clock, Gavel, Award, BarChart3, Search, Filter, SortAsc, Users, Loader, Grid, List } from "lucide-react";
import { useAuctions } from "../../hooks/useAuctions";
import { useStats } from "../../hooks/useStats";
import { useSubscriptionGuard } from "../../hooks/useSubscriptionGuard";
import SubscriptionModal from "../../components/SubscriptionModal";
import { useNavigate } from "react-router-dom";

function ActiveAuctions() {
    const {
        auctions,
        loading,
        loadingMore,
        pagination,
        loadMoreAuctions,
    } = useAuctions();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    const { stats } = useStats();
    const navigate = useNavigate();

    const {
        hasActiveSubscription,
        checking: checkingSubscription,
        showSubscriptionModal,
        setShowSubscriptionModal,
        guardAction,
        checkSubscription
    } = useSubscriptionGuard();

    const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

    // Check access on page load
    useEffect(() => {
        if (!checkingSubscription && !hasCheckedAccess) {
            if (!hasActiveSubscription) {
                guardAction();
            }
            setHasCheckedAccess(true);
        }
    }, [checkingSubscription, hasActiveSubscription, guardAction, hasCheckedAccess]);

    const handleLoadMore = () => {
        loadMoreAuctions();
    };

    const auctionStats = [
        {
            title: "Active Auctions",
            value: stats.activeAuctions?.toLocaleString('en-US'),
            change: "All Time",
            icon: <Gavel size={24} />,
            trend: "up"
        },
        {
            title: "New Today",
            value: stats.newToday?.toLocaleString('en-US'),
            change: "In Last 24 Hours",
            icon: <Award size={24} />,
            trend: "up"
        },
        {
            title: "Ending Soon",
            value: stats.endingSoon?.toLocaleString('en-US'),
            change: "In Next 24 Hours",
            icon: <Clock size={24} />,
            trend: "down",
            highlight: true
        },
    ];

    const categories = ["all", ...new Set(auctions.map(auction => auction.category))];
    
    const filteredAuctions = auctions
        .filter(auction => {
            const matchesSearch = searchTerm === "" ||
                auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "all" || auction.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .filter(auction => {
            switch (filter) {
                case "ending_soon":
                    const now = new Date();
                    const end = new Date(auction.endDate);
                    const diffHours = (end - now) / (1000 * 60 * 60);
                    return auction.status === 'active' && diffHours < 24;

                case "active":
                    return auction.status === 'active';

                case "approved":
                    return auction.status === 'approved';

                case "upcoming":
                    return auction.status === 'approved' || auction.status === 'draft' || auction.status === 'pending';

                case "ended":
                    return auction.status === 'ended';

                case "sold":
                    return auction.status === 'sold';

                case "draft":
                    return auction.status === 'draft';

                case "cancelled":
                    return auction.status === 'cancelled';

                case "reserve_not_met":
                    return auction.status === 'reserve_not_met';

                default:
                    return true;
            }
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "ending_soon":
                    return new Date(a.endDate) - new Date(b.endDate);
                case "most_bids":
                    return (b.bidCount || 0) - (a.bidCount || 0);
                case "highest_bid":
                    return (b.currentPrice || 0) - (a.currentPrice || 0);
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "lowest_bid":
                    return (a.currentPrice || 0) - (b.currentPrice || 0);
                default:
                    return new Date(a.endDate) - new Date(b.endDate);
            }
        });

    // Show loading while checking subscription
    if (checkingSubscription) {
        return (
            <section className="flex min-h-screen">
                <BidderSidebar />
                <div className="w-full relative">
                    <BidderHeader />
                    <BidderContainer>
                        <div className="flex justify-center items-center min-h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </BidderContainer>
                </div>
            </section>
        );
    }

    // If no active subscription, show nothing (modal handles the UI)
    if (!hasActiveSubscription) {
        return (
            <>
                <section className="flex min-h-screen">
                    <BidderSidebar />
                    <div className="w-full relative">
                        <BidderHeader />
                        <BidderContainer>
                            <div className="flex flex-col items-center justify-center min-h-96 text-center">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
                                    <Gavel size={48} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Subscription Required
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    You need an active subscription to view auctions
                                </p>
                                <button
                                    onClick={() => setShowSubscriptionModal(true)}
                                    className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors"
                                >
                                    View Plans
                                </button>
                            </div>
                        </BidderContainer>
                    </div>
                </section>
                
                <SubscriptionModal
                    isOpen={showSubscriptionModal}
                    onClose={() => {
                        setShowSubscriptionModal(false);
                        navigate("/");
                    }}
                    onSuccess={() => {
                        checkSubscription();
                        setHasCheckedAccess(false);
                    }}
                />
            </>
        );
    }

    return (
        <section className="flex min-h-screen">
            <BidderSidebar />

            <div className="w-full relative">
                <BidderHeader />

                <BidderContainer>
                    <AccountInactiveBanner />
                    <div className="max-w-full pt-16 pb-7 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold my-5">Active Auctions</h2>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {filteredAuctions.length} items found
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Search and Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search vehicle auctions by title or description..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center gap-2">
                                    <SortAsc size={18} className="text-gray-500" />
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="most_bids">Most Bids</option>
                                        <option value="highest_bid">Highest Bid</option>
                                        <option value="lowest_bid">Lowest Bid</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters with Status */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("ending_soon")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "ending_soon" ? "bg-red-100 text-red-800 border border-red-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Ending Soon
                            </button>
                            <button
                                onClick={() => setFilter("active")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "active" ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Active This Week
                            </button>
                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                                    title="Grid View"
                                >
                                    <Grid size={18} className={viewMode === "grid" ? "text-blue-600" : "text-gray-500"} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                                    title="List View"
                                >
                                    <List size={18} className={viewMode === "list" ? "text-blue-600" : "text-gray-500"} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Auction Cards Grid or List */}
                    {loading ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                                        <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="flex justify-between">
                                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                                        <div className="flex flex-col lg:flex-row gap-5">
                                            <div className="lg:w-64">
                                                <div className="h-48 bg-gray-200 rounded-lg"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <div key={i} className="space-y-2">
                                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                            <div className="h-5 bg-gray-200 rounded w-16"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : filteredAuctions.length > 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                                {filteredAuctions.map((auction) => (
                                    <AuctionCard
                                        key={auction._id}
                                        auction={auction}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2 mb-16">
                                {filteredAuctions.map((auction) => (
                                    <AuctionListItem
                                        key={auction._id}
                                        auction={auction}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No auctions found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                            <button
                                onClick={() => {
                                    setFilter("all");
                                    setSearchTerm("");
                                    setCategoryFilter("all");
                                }}
                                className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </BidderContainer>
            </div>
        </section>
    );
}

export default ActiveAuctions;