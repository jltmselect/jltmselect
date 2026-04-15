import { useState, useEffect } from "react";
import { BidderContainer, BidderHeader, BidderSidebar, AuctionCard, AuctionListItem, AccountInactiveBanner } from "../../components";
import { Clock, Gavel, Award, BarChart3, Search, SortAsc, Grid, List, Calendar, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { useAuctions } from "../../hooks/useAuctions";
import { useStats } from "../../hooks/useStats";
import { useSubscriptionGuard } from "../../hooks/useSubscriptionGuard";
import SubscriptionModal from "../../components/SubscriptionModal";
import { useNavigate } from "react-router-dom";
import { useBargainDeals } from "../../hooks/useBargainDeals";

function PastAuctions() {
    const {
            auctions,
            loading,
            loadingMore,
            pagination,
            filters: apiFilters,
            loadMoreDeals,
            updateFilters
        } = useBargainDeals();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("list");
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
            title: "Past Auctions",
            value: stats.endedAuctions?.toLocaleString('en-US') || "0",
            change: "Total Completed",
            icon: <Calendar size={24} />,
            trend: "up"
        },
        {
            title: "Items Sold",
            value: stats.soldAuctions?.toLocaleString('en-US') || "0",
            change: "Successfully Sold",
            icon: <CheckCircle size={24} />,
            trend: "up"
        },
        {
            title: "Unsold Items",
            value: stats.unsoldAuctions?.toLocaleString('en-US') || "0",
            change: "Reserve Not Met",
            icon: <XCircle size={24} />,
            trend: "down",
            highlight: true
        },
    ];

    // Filter and sort auctions for past auctions only
    const filteredAuctions = auctions
        .filter(auction => {
            const matchesSearch = searchTerm === "" ||
                auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.description?.toLowerCase().includes(searchTerm.toLowerCase());

            // Only show ended or sold auctions for past auctions
            const matchesFilter = () => {
                switch (filter) {
                    case "ended":
                        return auction.status === 'ended';
                    case "sold":
                        return auction.status === 'sold';
                    case "reserve_not_met":
                        return auction.status === 'reserve_not_met';
                    case "cancelled":
                        return auction.status === 'cancelled';
                    default:
                        return auction.status === 'ended' || auction.status === 'sold' ||
                            auction.status === 'reserve_not_met' || auction.status === 'cancelled';
                }
            };

            return matchesSearch && matchesFilter();
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "most_bids":
                    return (b.bidCount || 0) - (a.bidCount || 0);
                case "highest_bid":
                    return (b.currentPrice || 0) - (a.currentPrice || 0);
                case "lowest_bid":
                    return (a.currentPrice || 0) - (b.currentPrice || 0);
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.endDate) - new Date(b.endDate);
                default:
                    return new Date(b.endDate) - new Date(a.endDate);
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
                                    You need an active subscription to view past auctions
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
                                <h2 className="text-3xl md:text-4xl font-bold my-5">Past Auctions</h2>
                                {/* <p className="text-gray-500 dark:text-gray-400 -mt-3 mb-4">
                                    Browse completed auctions and sold items
                                </p> */}
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                                    {filteredAuctions.length} items found
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {auctionStats.map((stat, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.highlight ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{stat.title}</p>
                            </div>
                        ))}
                    </div> */}

                    {/* Enhanced Search and Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search past auctions by title or description..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center gap-2">
                                    <SortAsc size={18} className="text-gray-500" />
                                    <select
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="most_bids">Most Bids</option>
                                        <option value="highest_bid">Highest Final Price</option>
                                        <option value="lowest_bid">Lowest Final Price</option>
                                    </select>
                                </div>
                            </div>
                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mr-auto">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                                    title="Grid View"
                                >
                                    <Grid size={18} className={viewMode === "grid" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                                    title="List View"
                                >
                                    <List size={18} className={viewMode === "list" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Auction Cards Grid or List */}
                    {loading ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                                        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                        <div className="flex justify-between">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6 mb-16">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
                                        <div className="flex flex-col lg:flex-row gap-5">
                                            <div className="lg:w-64">
                                                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    {Array.from({ length: 4 }).map((_, i) => (
                                                        <div key={i} className="space-y-2">
                                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <Calendar size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No past auctions found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search criteria or filters</p>
                            <button
                                onClick={() => {
                                    setFilter("all");
                                    setSearchTerm("");
                                }}
                                className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {/* Load More Button */}
                    {!loading && filteredAuctions.length > 0 && pagination?.currentPage < pagination?.totalPages && (
                        <div className="flex justify-center mt-8 mb-16">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Loading more...
                                    </>
                                ) : (
                                    'Load More Past Auctions'
                                )}
                            </button>
                        </div>
                    )}
                </BidderContainer>
            </div>
        </section>
    );
}

export default PastAuctions;