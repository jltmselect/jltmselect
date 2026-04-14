import { useState, useEffect } from "react";
import { AdminContainer, AdminHeader, AdminSidebar } from "../../components";
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Eye, EyeOff, UserPlus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const AllCashiers = () => {
    const [cashiers, setCashiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();

    const fetchCashiers = async (page = 1, search = "", status = "all") => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: 10,
            });

            if (search) {
                params.append("search", search);
            }

            if (status !== "all") {
                params.append("status", status);
            }

            const { data } = await axiosInstance.get(`/api/v1/admin/cashiers?${params}`);

            if (data.success) {
                setCashiers(data.data.cashiers);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching cashiers:", error);
            toast.error("Failed to load cashiers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCashiers(1, searchTerm, statusFilter);
    }, [statusFilter]);

    const handleSearch = (value) => {
        setSearchTerm(value);

        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
            fetchCashiers(1, value, statusFilter);
        }, 500);

        setDebounceTimer(timer);
    };

    const handleStatusToggle = async (cashierId, currentStatus) => {
        try {
            const { data } = await axiosInstance.patch(`/api/v1/admin/cashiers/${cashierId}/status`, {
                isActive: !currentStatus,
            });

            if (data.success) {
                toast.success(data.message);
                fetchCashiers(1, searchTerm, statusFilter);
            }
        } catch (error) {
            console.error("Error updating cashier status:", error);
            toast.error("Failed to update cashier status");
        }
    };

    const handleDelete = async (cashierId, cashierName) => {
        if (!window.confirm(`Are you sure you want to delete ${cashierName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const { data } = await axiosInstance.delete(`/api/v1/admin/cashiers/${cashierId}`);

            if (data.success) {
                toast.success("Cashier deleted successfully");
                fetchCashiers(1, searchTerm, statusFilter);
            }
        } catch (error) {
            console.error("Error deleting cashier:", error);
            toast.error("Failed to delete cashier");
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (!event.target.closest('.relative')) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="w-full relative">
                <AdminHeader />

                <AdminContainer>
                    <div className="pt-16 md:py-7">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Cashiers Management</h1>
                                <p className="text-gray-600 mt-1">Manage cashier accounts for discount verification</p>
                            </div>
                            <button
                                onClick={() => navigate("/admin/cashiers/add")}
                                className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <UserPlus size={18} />
                                Add Cashier
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search cashiers by name, email..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                        {/* Cashiers Table */}
                        {loading ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : cashiers.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {cashiers.map((cashier) => (
                                                <tr key={cashier._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <User size={18} className="text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {cashier.firstName} {cashier.lastName}
                                                                </p>
                                                                <p className="text-sm text-gray-500">@{cashier.username}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                                                <Mail size={14} /> {cashier.email}
                                                            </p>
                                                            {cashier.phone && (
                                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <Phone size={14} /> {cashier.phone}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cashier.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {cashier.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(cashier.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center gap-5 justify-center">
                                                            {/* <button
                                                                onClick={() => handleStatusToggle(cashier._id, cashier.isActive)}
                                                                className={`flex items-center gap-3 text-sm ${cashier.isActive ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'} transition-colors`}
                                                            >
                                                                {cashier.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                                            </button> */}

                                                            <button
                                                                onClick={() => handleDelete(cashier._id, `${cashier.firstName} ${cashier.lastName}`)}
                                                                className="flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Info */}
                                {pagination && (
                                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                        <div className="text-sm text-gray-500">
                                            Showing {cashiers.length} of {pagination.totalCashiers} cashiers
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No cashiers found</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm
                                        ? "No cashiers match your search criteria"
                                        : "Start by adding your first cashier"}
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => navigate("/admin/cashiers/add")}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Plus size={18} />
                                        Add Your First Cashier
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </AdminContainer>
            </div>
        </section>
    );
};

export default AllCashiers;