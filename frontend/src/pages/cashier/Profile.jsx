import { useState, useEffect } from "react";
import { CashierContainer, CashierHeader, CashierSidebar, LoadingSpinner } from "../../components";
import { User, Mail, Phone, Lock, Edit, Save, X, Camera, Upload } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Fetch user data
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/api/v1/users/profile');
            if (data.success) {
                setUserData(data.data.user);
            }
        } catch (err) {
            console.error('Fetch profile error:', err);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append('firstName', userData.firstName || '');
            formData.append('lastName', userData.lastName || '');
            formData.append('phone', userData.phone || '');
            formData.append('username', userData.username || '');
            if (imageFile) formData.append('image', imageFile);

            const { data } = await axiosInstance.put('/api/v1/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                setUserData(data.data.user);
                setIsEditing(false);
                setImageFile(null);
                setImagePreview(null);
                toast.success("Profile updated successfully");
            }
        } catch (err) {
            console.error('Update error:', err);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        fetchUserData();
        setIsEditing(false);
        setImageFile(null);
        setImagePreview(null);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setSaving(true);
            const { data } = await axiosInstance.put('/api/v1/users/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (data.success) {
                toast.success("Password changed successfully");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setShowPasswordForm(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <CashierSidebar />
                <div className="w-full relative">
                    <CashierHeader />
                    <CashierContainer>
                        <div className="flex justify-center items-center min-h-96">
                            <LoadingSpinner />
                        </div>
                    </CashierContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen bg-gray-50">
            <CashierSidebar />

            <div className="w-full relative">
                <CashierHeader />

                <CashierContainer>
                    <div className="pt-16 pb-7 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold my-5">Cashier Profile</h2>
                                <p className="text-gray-600">Manage your account settings</p>
                            </div>
                            {!showPasswordForm && (
                                <div className="mt-4 md:mt-0 flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                            >
                                                <Save size={16} />
                                                {saving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                            >
                                                <X size={16} />
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                            >
                                                <Edit size={16} />
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={() => setShowPasswordForm(true)}
                                                className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90"
                                            >
                                                <Lock size={16} />
                                                Change Password
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {showPasswordForm ? (
                        // Password Change Form
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-full mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Change Password</h3>
                                <button
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-secondary py-2.5 text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50"
                                    >
                                        {saving ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // Profile Information
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center">
                                    <div className="relative group">
                                        <img
                                            src={imagePreview || userData?.image || "https://via.placeholder.com/100"}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                        />
                                        {isEditing && (
                                            <label className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Camera size={24} className="text-white" />
                                                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <p className="text-xs text-gray-500 mt-2">Click image to upload</p>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <div className="flex items-center gap-2">
                                            <User size={18} className="text-gray-400" />
                                            <input
                                                type="text"
                                                value={userData?.firstName || ""}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                disabled={!isEditing}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <div className="flex items-center gap-2">
                                            <User size={18} className="text-gray-400" />
                                            <input
                                                type="text"
                                                value={userData?.lastName || ""}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                disabled={!isEditing}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <div className="flex items-center gap-2">
                                            <Mail size={18} className="text-gray-400" />
                                            <input
                                                type="email"
                                                value={userData?.email || ""}
                                                disabled
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <div className="flex items-center gap-2">
                                            <Phone size={18} className="text-gray-400" />
                                            <input
                                                type="tel"
                                                value={userData?.phone || ""}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                disabled={!isEditing}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={userData?.username || ""}
                                            onChange={(e) => handleInputChange("username", e.target.value)}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                                        <input
                                            type="text"
                                            value={userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : ""}
                                            disabled
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CashierContainer>
            </div>
        </section>
    );
}

export default Profile;