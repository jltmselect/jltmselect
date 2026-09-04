import { useState, useEffect } from "react";
import { AdminContainer, AdminHeader, AdminSidebar, LoadingSpinner } from "../../components";
import { Plus, Search, Edit, Trash2, Eye, X, Save, AlertCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

function SmsTemplates() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({ name: "", body: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get("/api/v1/admin/sms/templates", {
                params: { search, limit: 100 },
            });
            if (data.success) setTemplates(data.data.templates);
        } catch (error) {
            toast.error("Failed to load templates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.body.trim()) {
            toast.error("Name and body are required");
            return;
        }
        setIsSubmitting(true);
        try {
            if (editingTemplate) {
                const { data } = await axiosInstance.put(
                    `/api/v1/admin/sms/templates/${editingTemplate._id}`,
                    formData
                );
                toast.success("Template updated");
            } else {
                const { data } = await axiosInstance.post("/api/v1/admin/sms/templates", formData);
                toast.success("Template created");
            }
            resetForm();
            fetchTemplates();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", body: "" });
        setEditingTemplate(null);
        setShowModal(false);
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await axiosInstance.delete(`/api/v1/admin/sms/templates/${deleteConfirm._id}`);
            toast.success("Template deleted");
            setDeleteConfirm(null);
            fetchTemplates();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    };

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="w-full relative">
                <AdminHeader />
                <AdminContainer>
                    <div className="max-w-full pt-16 pb-7 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold my-5">SMS Templates</h2>
                            </div>
                            <button
                                onClick={() => { setEditingTemplate(null); setFormData({ name: "", body: "" }); setShowModal(true); }}
                                className="mt-4 md:mt-0 flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-4 py-3 rounded-lg transition-colors"
                            >
                                <Plus size={20} /> Add Template
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Templates Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Body</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {templates.map((template) => (
                                        <tr key={template._id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6 font-medium">{template.name}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 max-w-md truncate">{template.body}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setEditingTemplate(template); setFormData({ name: template.name, body: template.body }); setShowModal(true); }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(template)}
                                                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {templates.length === 0 && !loading && (
                                <div className="text-center py-12 text-gray-500">No templates found</div>
                            )}
                            {loading && <div className="flex justify-center py-12"><LoadingSpinner /></div>}
                        </div>
                    </div>

                    {/* Create/Edit Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">{editingTemplate ? "Edit Template" : "Create Template"}</h3>
                                    <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Membership Promotion"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SMS Body *</label>
                                        <textarea
                                            value={formData.body}
                                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter SMS text to be sent."
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                                        <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50">
                                            {isSubmitting ? "Saving..." : (editingTemplate ? "Update" : "Create")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation */}
                    {deleteConfirm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                    <h3 className="text-lg font-semibold">Delete Template</h3>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                    <button onClick={handleDelete} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Delete</button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminContainer>
            </div>
        </section>
    );
}

export default SmsTemplates;