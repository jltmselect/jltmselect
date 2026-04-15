import { useState, useEffect } from "react";
import {
    BidderContainer,
    BidderHeader,
    BidderSidebar,
    AccountInactiveBanner,
} from "../../components";
import VideoCard from "../../components/VideoCard";
import { useSubscriptionGuard } from "../../hooks/useSubscriptionGuard";
import SubscriptionModal from "../../components/SubscriptionModal";
import { useNavigate } from "react-router-dom";
import { Play, Search, Loader, Grid, List } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
    const navigate = useNavigate();

    const {
        hasActiveSubscription,
        checking: checkingSubscription,
        showSubscriptionModal,
        setShowSubscriptionModal,
        guardAction,
        checkSubscription,
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

    // Fetch videos
    const fetchVideos = async (page = 1, search = "") => {
        try {
            const loadingState = page > 1 ? setLoadingMore : setLoading;
            loadingState(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: 12,
            });

            if (search) {
                params.append("search", search);
            }

            const { data } = await axiosInstance.get(`/api/v1/videos?${params}`);

            if (data.success) {
                if (page > 1) {
                    setVideos((prev) => [...prev, ...data.data.videos]);
                } else {
                    setVideos(data.data.videos);
                }
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (hasActiveSubscription) {
            fetchVideos(1, searchTerm);
        }
    }, [hasActiveSubscription]);

    // Handle search with debounce
    const handleSearch = (value) => {
        setSearchTerm(value);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            fetchVideos(1, value);
        }, 500);

        setDebounceTimer(timer);
    };

    // Load more videos
    const handleLoadMore = () => {
        if (pagination?.currentPage < pagination?.totalPages) {
            fetchVideos(pagination.currentPage + 1, searchTerm);
        }
    };

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

    // If no active subscription, show subscription required UI
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
                                    <Play size={48} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Subscription Required
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    You need an active subscription to access videos
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
                                <h2 className="text-3xl md:text-4xl font-bold my-5">
                                    Showroom Videos
                                </h2>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {pagination?.totalVideos || 0} videos
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Search and View Toggle */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search videos by title or description..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* View Mode Toggle */}
                            {/* <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
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
                            </div> */}
                        </div>
                    </div>

                    {/* Videos Grid/List */}
                    {loading && videos.length === 0 ? (
                        viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse"
                                    >
                                        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                                        <div className="p-4">
                                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-5">
                                            <div className="lg:w-64">
                                                <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                                                <div className="flex gap-4">
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : videos.length > 0 ? (
                        <>
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                    {videos.map((video) => (
                                        <VideoCard key={video._id} video={video} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4 mb-8">
                                    {videos.map((video) => (
                                        <VideoListItem key={video._id} video={video} />
                                    ))}
                                </div>
                            )}

                            {/* Load More Button */}
                            {pagination?.currentPage < pagination?.totalPages && (
                                <div className="flex justify-center mt-4 mb-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                        className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader size={16} className="animate-spin" />
                                                Loading more videos...
                                            </>
                                        ) : (
                                            <>
                                                Load More Videos
                                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                                    {pagination.totalVideos - videos.length} more
                                                </span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* End of Videos Message */}
                            {pagination?.currentPage >= pagination?.totalPages && videos.length > 0 && (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>You've seen all {pagination.totalVideos} videos</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <Play size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No videos found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {searchTerm
                                    ? "No videos match your search criteria"
                                    : "No showroom videos are available at the moment"}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        fetchVideos(1, "");
                                    }}
                                    className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </BidderContainer>
            </div>

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
        </section>
    );
}

// Video List Item Component for List View
const VideoListItem = ({ video }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Thumbnail */}
                <div className="lg:w-64">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                            <Play size={32} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                        {video.title}
                    </h3>
                    {video.description && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                            {video.description}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Added by {video.addedByUsername}</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Videos;