// pages/admin/AdminVideos.jsx
import { useState, useEffect } from "react";
import { AdminContainer, AdminHeader, AdminSidebar } from "../../components";
import { Plus, Search, Trash2, Eye, EyeOff, Loader, Play, Youtube, X, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import YouTubeEmbed from "../../components/YouTubeEmbed";
import { useForm, useWatch } from "react-hook-form";

const AdminVideos = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
            youtubeUrl: "",
        },
    });

    // Watch youtubeUrl for preview - this is a Hook, must be at top level
    const watchedYoutubeUrl = useWatch({
        control,
        name: "youtubeUrl",
    });

    const fetchVideos = async (page = 1, search = "", status = "all") => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: 12,
            });

            if (search) {
                params.append("search", search);
            }

            if (status !== "all") {
                params.append("status", status);
            }

            const { data } = await axiosInstance.get(`/api/v1/videos/admin/all?${params}`);

            if (data.success) {
                setVideos(data.data.videos);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos(1, searchTerm, statusFilter);
    }, [statusFilter]);

    const handleSearch = (value) => {
        setSearchTerm(value);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            fetchVideos(1, value, statusFilter);
        }, 500);

        setDebounceTimer(timer);
    };

    const handleStatusToggle = async (videoId, currentStatus) => {
        try {
            const newStatus = currentStatus === "active" ? "inactive" : "active";
            const { data } = await axiosInstance.patch(`/api/v1/videos/admin/${videoId}/status`, {
                status: newStatus,
            });

            if (data.success) {
                toast.success(data.message);
                fetchVideos(1, searchTerm, statusFilter);
            }
        } catch (error) {
            console.error("Error updating video status:", error);
            toast.error("Failed to update video status");
        }
    };

    const handleDelete = async (videoId) => {
        if (!window.confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
            return;
        }

        try {
            const { data } = await axiosInstance.delete(`/api/v1/videos/admin/${videoId}`);

            if (data.success) {
                toast.success("Video deleted successfully");
                fetchVideos(1, searchTerm, statusFilter);
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            toast.error("Failed to delete video");
        }
    };

    const onAddVideoSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const response = await axiosInstance.post("/api/v1/videos/add", data);

            if (response.data.success) {
                toast.success("Video added successfully!");
                reset();
                setShowAddModal(false);
                fetchVideos(1, searchTerm, statusFilter);
            }
        } catch (error) {
            console.error("Error adding video:", error);
            toast.error(error?.response?.data?.message || "Failed to add video");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="w-full relative">
                <AdminHeader />

                <AdminContainer>
                    <div className="pt-16 md:py-7">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Showroom Videos</h1>
                                <p className="text-gray-600 mt-1">Manage video content for bidders</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Plus size={18} />
                                Add New Video
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search videos by title or description..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Videos Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse"
                                    >
                                        <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                                        <div className="p-4">
                                            <div className="h-5 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                            <div className="flex justify-between mt-3">
                                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {videos.map((video) => (
                                    <div
                                        key={video._id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="relative">
                                            <YouTubeEmbed videoId={video.youtubeUrl} title={video.title} />
                                            <div
                                                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${video.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {video.status === "active" ? "Active" : "Inactive"}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{video.title}</h3>
                                            {video.description && (
                                                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{video.description}</p>
                                            )}
                                            <div className="text-xs text-gray-500 mb-3">
                                                Added by {video.addedByUsername} • {new Date(video.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusToggle(video._id, video.status)}
                                                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${video.status === "active"
                                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            : "bg-green-50 text-green-700 hover:bg-green-100"
                                                        }`}
                                                >
                                                    {video.status === "active" ? (
                                                        <>
                                                            <EyeOff size={14} />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye size={14} />
                                                            Activate
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(video._id)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <Play size={64} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No videos found</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm
                                        ? "No videos match your search criteria"
                                        : "Start by adding your first showroom video"}
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Plus size={18} />
                                        Add Your First Video
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination Info */}
                        {pagination && videos.length > 0 && (
                            <div className="mt-6 text-center text-gray-500 text-sm">
                                Showing {videos.length} of {pagination.totalVideos} videos
                            </div>
                        )}
                    </div>
                </AdminContainer>
            </div>

            {/* Add Video Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Youtube size={24} className="text-red-500" />
                                    <h3 className="text-xl font-semibold text-gray-900">Add Showroom Video</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        reset();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onAddVideoSubmit)} className="p-6 space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Video Title *
                                </label>
                                <input
                                    {...register("title", {
                                        required: "Video title is required",
                                        minLength: {
                                            value: 3,
                                            message: "Title must be at least 3 characters",
                                        },
                                    })}
                                    id="title"
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="e.g., Zinus MoDRN Rectangular Dining Table"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* YouTube URL */}
                            <div>
                                <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    YouTube URL *
                                </label>
                                <div className="relative">
                                    <Youtube size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" />
                                    <input
                                        {...register("youtubeUrl", {
                                            required: "YouTube URL is required",
                                            pattern: {
                                                value: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                                                message: "Please enter a valid YouTube URL",
                                            },
                                        })}
                                        id="youtubeUrl"
                                        type="url"
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                                {errors.youtubeUrl && (
                                    <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl.message}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter any YouTube video URL (e.g., https://www.youtube.com/watch?v=...)
                                </p>
                            </div>

                            {/* Description (Optional) */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    {...register("description")}
                                    id="description"
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Brief description of the video content..."
                                />
                            </div>

                            {/* Preview Section */}
                            {/* {watchedYoutubeUrl && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                                    <div className="w-full max-w-md mx-auto">
                                        <YouTubeEmbed videoId={watchedYoutubeUrl} title="Preview" />
                                    </div>
                                </div>
                            )} */}

                            {/* Form Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        reset();
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Add Video
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminVideos;