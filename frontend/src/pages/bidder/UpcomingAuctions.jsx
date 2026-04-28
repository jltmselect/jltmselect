import { useState, useEffect } from "react";
import { BidderContainer, BidderHeader, BidderSidebar, AuctionCard, AuctionListItem, AccountInactiveBanner } from "../../components";
import { Clock, Gavel, Award, BarChart3, Search, Filter, SortAsc, Users, Loader, Grid, List, Calendar } from "lucide-react";
import { useAuctions } from "../../hooks/useAuctions";
import { useStats } from "../../hooks/useStats";
import { useSubscriptionGuard } from "../../hooks/useSubscriptionGuard";
import SubscriptionModal from "../../components/SubscriptionModal";
import { useNavigate } from "react-router-dom";

function UpcomingAuctions() {
    const {
        auctions,
        loading,
        loadingMore,
        pagination,
        loadMoreAuctions,
        updateFilters
    } = useAuctions();
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("list"); // "grid" or "list"
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

    // Set filter to show only approved (upcoming) auctions
    useEffect(() => {
        updateFilters({ status: 'approved' });
    }, []);

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
            title: "Upcoming Auctions",
            value: auctions.filter(a => a.status === 'approved').length.toLocaleString('en-US'),
            change: "Ready to Bid",
            icon: <Calendar size={24} />,
            trend: "up"
        },
        {
            title: "This Week",
            value: auctions.filter(a => {
                const startDate = new Date(a.startDate);
                const now = new Date();
                const weekFromNow = new Date();
                weekFromNow.setDate(now.getDate() + 7);
                return a.status === 'approved' && startDate >= now && startDate <= weekFromNow;
            }).length.toLocaleString('en-US'),
            change: "Starting Soon",
            icon: <Clock size={24} />,
            trend: "up"
        },
        {
            title: "Categories",
            value: [...new Set(auctions.filter(a => a.status === 'approved').map(a => a.category))].length,
            change: "Different Types",
            icon: <Award size={24} />,
            trend: "up"
        },
    ];

    const categories = ["all", ...new Set(auctions.filter(a => a.status === 'approved').map(auction => auction.category))];

    const filteredAuctions = auctions
        .filter(auction => auction.status === 'approved') // Only show approved auctions
        .filter(auction => {
            const matchesSearch = searchTerm === "" ||
                auction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                auction.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === "all" || auction.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .filter(auction => {
            switch (filter) {
                case "starting_soon":
                    const now = new Date();
                    const start = new Date(auction.startDate);
                    const diffHours = (start - now) / (1000 * 60 * 60);
                    return diffHours < 48 && diffHours > 0; // Starting within 48 hours

                case "this_week":
                    const nowDate = new Date();
                    const weekFromNow = new Date();
                    weekFromNow.setDate(nowDate.getDate() + 7);
                    const startDate = new Date(auction.startDate);
                    return startDate >= nowDate && startDate <= weekFromNow;

                case "next_week":
                    const nextWeekStart = new Date();
                    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
                    const nextWeekEnd = new Date();
                    nextWeekEnd.setDate(nextWeekEnd.getDate() + 14);
                    const auctionStart = new Date(auction.startDate);
                    return auctionStart >= nextWeekStart && auctionStart <= nextWeekEnd;

                case "next_month":
                    const nextMonthStart = new Date();
                    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1);
                    nextMonthStart.setDate(1); // Start of next month
                    nextMonthStart.setHours(0, 0, 0, 0);

                    const nextMonthEnd = new Date();
                    nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 2);
                    nextMonthEnd.setDate(0); // Last day of next month
                    nextMonthEnd.setHours(23, 59, 59, 999);

                    const auctionStartDate = new Date(auction.startDate);
                    return auctionStartDate >= nextMonthStart && auctionStartDate <= nextMonthEnd;

                default:
                    return true;
            }
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "starting_soon":
                    return new Date(a.startDate) - new Date(b.startDate);
                case "newest":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "most_interest":
                    return (b.watchlistCount || 0) - (a.watchlistCount || 0);
                default:
                    return new Date(a.startDate) - new Date(b.startDate);
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
                                    <Calendar size={48} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Subscription Required
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    You need an active subscription to view upcoming auctions
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
                                <h2 className="text-3xl md:text-4xl font-bold my-5">Upcoming Auctions</h2>
                                {/* <p className="text-gray-500 mb-4">Browse and preview auctions that are scheduled to start soon</p> */}
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {filteredAuctions.length} upcoming items
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {auctionStats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                                    </div>
                                    <div className="text-blue-500">
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> */}

                    {/* Enhanced Search and Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search upcoming auctions by title or description..."
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
                                        <option value="starting_soon">Starting Soon</option>
                                        <option value="newest">Newest Listings</option>
                                        <option value="oldest">Oldest Listings</option>
                                        {/* <option value="most_interest">Most Interest</option> */}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Category Filter */}
                        {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                {console.log(categories)}
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === "all" ? "All Categories" : cat}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                All Upcoming
                            </button>
                            <button
                                onClick={() => setFilter("starting_soon")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "starting_soon" ? "bg-red-100 text-red-800 border border-red-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Starting Soon (48h)
                            </button>
                            <button
                                onClick={() => setFilter("this_week")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "this_week" ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                This Week
                            </button>
                            <button
                                onClick={() => setFilter("next_week")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "next_week" ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Next Week
                            </button>
                            <button
                                onClick={() => setFilter("next_month")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "next_month" ? "bg-purple-100 text-purple-800 border border-purple-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                Next Month
                            </button>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg ml-auto">
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
                        <>
                            {viewMode === "grid" ? (
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
                            )}

                            {/* Load More Button */}
                            {pagination && pagination.currentPage < pagination.totalPages && (
                                <div className="flex justify-center mt-8 mb-16">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loadingMore ? (
                                            <div className="flex items-center gap-2">
                                                <Loader size={20} className="animate-spin" />
                                                Loading...
                                            </div>
                                        ) : (
                                            "Load More Auctions"
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No upcoming auctions found</h3>
                            <p className="text-gray-500 mb-6">Check back later for new auctions or adjust your filters</p>
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

export default UpcomingAuctions;