import { useState, useEffect } from "react";
import { X, Users, Calendar, AlertCircle, Search as SearchIcon } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import AsyncSelect from 'react-select/async';

const CampaignFormModal = ({ isOpen, onClose, onSuccess, campaign }) => {
    const [formData, setFormData] = useState({
        title: "",
        templateId: "",
        recipients: { type: "all", value: "all" },
        filters: {},
        scheduleDate: "",
    });
    const [templates, setTemplates] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for the user search dropdown
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userSearchLoading, setUserSearchLoading] = useState(false);

    // Load templates and subscriptions on mount
    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
            fetchSubscriptions();
            if (campaign) {
                setFormData({
                    title: campaign.title,
                    templateId: campaign.templateId?._id || "",
                    recipients: campaign.recipients,
                    filters: campaign.filters || {},
                    scheduleDate: campaign.scheduleDate ? new Date(campaign.scheduleDate).toISOString().slice(0, 16) : "",
                });
                // If campaign has individual users, pre-populate the select
                if (campaign.recipients.type === "individual" && Array.isArray(campaign.recipients.value)) {
                    // We need to fetch user details for those IDs to display them
                    fetchUserDetails(campaign.recipients.value);
                } else {
                    setSelectedUsers([]);
                }
                handlePreview();
            } else {
                setFormData({
                    title: "",
                    templateId: "",
                    recipients: { type: "all", value: "all" },
                    filters: {},
                    scheduleDate: "",
                });
                setSelectedUsers([]);
                setPreview(null);
            }
        }
    }, [isOpen, campaign]);

    // Fetch user details for preselected IDs (when editing)
    const fetchUserDetails = async (userIds) => {
        if (!userIds || userIds.length === 0) return;
        try {
            const promises = userIds.map(id =>
                axiosInstance.get(`/api/v1/admin/users/${id}`).then(res => res.data.data.user)
            );
            const users = await Promise.all(promises);
            const options = users.map(user => ({
                value: user._id,
                label: `${user.username} (${user.email})`,
                user: user,
            }));
            setSelectedUsers(options);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/admin/sms/templates", { params: { isActive: true, limit: 100 } });
            if (data.success) setTemplates(data.data.templates);
        } catch (error) {
            toast.error("Failed to load templates");
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const { data } = await axiosInstance.get("/api/v1/subscriptions", { params: { limit: 100 } });
            if (data.success) setSubscriptions(data.data.subscriptions);
        } catch (error) {
            // ignore if subscription endpoint not available
        }
    };

    // Debounced search for users
    const loadUserOptions = async (inputValue) => {
        // Allow search with at least 1 character
        if (!inputValue || inputValue.length < 1) {
            return [];
        }

        setUserSearchLoading(true);
        try {
            const { data } = await axiosInstance.get("/api/v1/admin/users", {
                params: { search: inputValue, limit: 20 }
                // fields param is not used by the backend
            });

            if (data.success) {
                const options = data.data.users.map(user => ({
                    value: user._id,
                    label: `${user.username} (${user.email}) - ${user.phone || "No phone"}`,
                    user: user,
                }));
                return options;
            } else {
                return [];
            }
        } catch (error) {
            console.error("User search error:", error);
            return [];
        } finally {
            setUserSearchLoading(false);
        }
    };

    const handleUserSelectChange = (selectedOptions) => {
        setSelectedUsers(selectedOptions || []);
        // Update formData.recipients.value to array of IDs
        const userIds = (selectedOptions || []).map(opt => opt.value);
        setFormData({
            ...formData,
            recipients: {
                ...formData.recipients,
                value: userIds,
            },
        });
    };

    const handlePreview = async () => {
        if (!formData.recipients || !formData.recipients.type) return;
        setLoading(true);
        try {
            const { data } = await axiosInstance.post("/api/v1/admin/sms/campaigns/preview-recipients", {
                recipients: formData.recipients,
                filters: formData.filters,
            });
            if (data.success) setPreview(data.data);
        } catch (error) {
            toast.error("Failed to preview recipients");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.templateId) {
            toast.error("Title and template are required");
            return;
        }

        setIsSubmitting(true);
        try {
            // Convert scheduleDate to UTC ISO string
            let scheduleISO = null;
            if (formData.scheduleDate) {
                const date = new Date(formData.scheduleDate);
                if (!isNaN(date.getTime())) {
                    scheduleISO = date.toISOString(); // "2026-09-05T04:30:00.000Z"
                }
            }

            const payload = {
                title: formData.title,
                templateId: formData.templateId,
                recipients: formData.recipients,
                filters: formData.filters,
                scheduleDate: scheduleISO, // send UTC time
            };

            let response;
            if (campaign) {
                response = await axiosInstance.put(
                    `/api/v1/admin/sms/campaigns/${campaign._id}`,
                    payload
                );
            } else {
                response = await axiosInstance.post("/api/v1/admin/sms/campaigns", payload);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold">{campaign ? "Edit Campaign" : "New Campaign"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Summer Promo"
                            required
                        />
                    </div>

                    {/* Template */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SMS Template *</label>
                        <select
                            value={formData.templateId}
                            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a template</option>
                            {templates.map((t) => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                            ))}
                        </select>
                        {formData.templateId && (
                            <p className="text-xs text-gray-500 mt-1">
                                Body preview: {templates.find(t => t._id === formData.templateId)?.body?.substring(0, 100)}...
                            </p>
                        )}
                    </div>

                    {/* Recipients */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <select
                                    value={formData.recipients.type}
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        let value = "";
                                        if (type === "all") value = "all";
                                        else if (type === "userType") value = "bidder";
                                        else if (type === "subscription") value = "";
                                        else if (type === "individual") value = [];
                                        else if (type === "custom") value = {};
                                        setFormData({
                                            ...formData,
                                            recipients: { type, value },
                                            filters: type === "custom" ? { userType: "bidder" } : {},
                                        });
                                        if (type !== "individual") setSelectedUsers([]);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Active Users</option>
                                    <option value="userType">By User Type</option>
                                    <option value="subscription">By Subscription Plan</option>
                                    <option value="individual">Individual Users (search)</option>
                                    {/* <option value="custom">Custom Filter</option> */}
                                </select>
                            </div>
                            <div>
                                {formData.recipients.type === "userType" && (
                                    <select
                                        value={formData.recipients.value}
                                        onChange={(e) => setFormData({ ...formData, recipients: { ...formData.recipients, value: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="bidder">Bidder</option>
                                    </select>
                                )}
                                {formData.recipients.type === "subscription" && (
                                    <select
                                        value={formData.recipients.value}
                                        onChange={(e) => setFormData({ ...formData, recipients: { ...formData.recipients, value: e.target.value } })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a plan</option>
                                        {subscriptions.map((s) => (
                                            <option key={s._id} value={s._id}>{s.title}</option>
                                        ))}
                                    </select>
                                )}
                                {formData.recipients.type === "individual" && (
                                    <AsyncSelect
                                        isMulti
                                        loadOptions={loadUserOptions}
                                        onChange={handleUserSelectChange}
                                        value={selectedUsers}
                                        placeholder="Search by username, email, or phone..."
                                        classNamePrefix="react-select"
                                        loadingMessage={() => "Searching users..."}
                                        noOptionsMessage={() => "No users found"}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: "42px",
                                                borderColor: "#d1d5db",
                                            }),
                                        }}
                                    />
                                )}
                                {formData.recipients.type === "custom" && (
                                    <input
                                        type="text"
                                        value={JSON.stringify(formData.filters)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                setFormData({ ...formData, filters: parsed });
                                            } catch (err) {
                                                // ignore
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder='e.g., {"userType":"bidder","address.country":"US"}'
                                    />
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handlePreview}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                            <Users size={14} /> Preview Recipients
                        </button>
                        {loading && <LoadingSpinner />}
                        {preview && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                <p>Total: <strong>{preview.total}</strong> users</p>
                                {preview.sample?.length > 0 && (
                                    <div className="mt-1">
                                        <p className="font-medium">Sample:</p>
                                        <ul className="list-disc list-inside text-gray-600">
                                            {preview.sample.slice(0, 5).map((u, i) => (
                                                <li key={i}>{u.firstName} {u.lastName} ({u.phone})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (optional)</label>
                        <input
                            type="datetime-local"
                            value={formData.scheduleDate}
                            onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately (draft status).</p>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50">
                            {isSubmitting ? "Saving..." : (campaign ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CampaignFormModal;