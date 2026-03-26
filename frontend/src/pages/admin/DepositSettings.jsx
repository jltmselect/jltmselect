import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import {
    Save,
    Banknote,
    Percent,
    Settings,
    Shield,
    AlertCircle,
    DollarSign,
    TrendingUp
} from 'lucide-react';
import { AdminContainer, AdminHeader, AdminSidebar } from '../../components';

const DepositSettings = () => {
    const [settings, setSettings] = useState({
        depositType: 'fixed',
        depositValue: 5,
        minDepositAmount: 1,
        maxDepositAmount: null,
        isActive: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch deposit settings
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/api/v1/deposit-settings');
            if (data.success) {
                setSettings(data.data.settings);
            }
        } catch (err) {
            console.error('Fetch deposit settings error:', err);
            toast.error(err.response?.data?.message || "Failed to fetch deposit settings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Handle deposit type change
    const handleDepositTypeChange = (type) => {
        setSettings(prev => ({
            ...prev,
            depositType: type,
            // Reset value if switching to percentage and current value > 100
            depositValue: type === 'percentage' && prev.depositValue > 100 ? 5 : prev.depositValue
        }));
    };

    // Handle deposit value change
    const handleDepositValueChange = (value) => {
        const numValue = parseFloat(value) || 0;

        // Validate percentage doesn't exceed 100
        if (settings.depositType === 'percentage' && numValue > 100) {
            toast.error('Percentage cannot exceed 100%');
            return;
        }

        setSettings(prev => ({
            ...prev,
            depositValue: numValue
        }));
    };

    // Handle min deposit change
    const handleMinDepositChange = (value) => {
        const numValue = parseFloat(value) || 0;

        // Validate against max deposit if set
        if (settings.maxDepositAmount && numValue > settings.maxDepositAmount) {
            toast.error('Minimum deposit cannot exceed maximum deposit');
            return;
        }

        setSettings(prev => ({
            ...prev,
            minDepositAmount: numValue
        }));
    };

    // Handle max deposit change
    const handleMaxDepositChange = (value) => {
        const numValue = value === '' ? null : parseFloat(value);

        // Validate against min deposit
        if (numValue !== null && numValue < settings.minDepositAmount) {
            toast.error('Maximum deposit cannot be less than minimum deposit');
            return;
        }

        setSettings(prev => ({
            ...prev,
            maxDepositAmount: numValue
        }));
    };

    // Save deposit settings
    const handleSave = async () => {
        console.log(settings.isActive)
        try {
            setSaving(true);
            const { data } = await axiosInstance.put('/api/v1/deposit-settings', {
                depositType: settings.depositType,
                depositValue: settings.depositValue,
                minDepositAmount: settings.minDepositAmount,
                maxDepositAmount: settings.maxDepositAmount,
                isActive: settings.isActive
            });

            if (data.success) {
                toast.success('Deposit settings updated successfully');
                setSettings(data.data.settings);
            }
        } catch (err) {
            console.error('Update deposit settings error:', err);
            toast.error(err.response?.data?.message || "Failed to update deposit settings");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleDeposit = async (e) => {
        const newIsActive = e.target.checked;

        // Update local state
        setSettings(prev => ({ ...prev, isActive: newIsActive }));

        // Save to API with the new value directly
        try {
            setSaving(true);
            const { data } = await axiosInstance.put('/api/v1/deposit-settings', {
                ...settings, // Spread existing settings
                isActive: newIsActive // Override with new value
            });

            if (data.success) {
                toast.success(`Deposits ${newIsActive ? 'enabled' : 'disabled'} successfully`);
                setSettings(data.data.settings);
            }
        } catch (err) {
            console.error('Update deposit settings error:', err);
            toast.error(err.response?.data?.message || "Failed to update deposit settings");
            // Revert local state on error
            setSettings(prev => ({ ...prev, isActive: !newIsActive }));
        } finally {
            setSaving(false);
        }
    };

    // Get display value with symbol
    const getDisplayValue = () => {
        const value = settings.depositValue || 0;
        return settings.depositType === 'fixed' ? `$${value}` : `${value}%`;
    };

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="w-full relative">
                <AdminHeader />

                <AdminContainer>
                    <div className="max-w-full pt-16 pb-7 md:pt-0">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield size={32} className="text-purple-600" />
                            <h2 className="text-3xl md:text-4xl font-bold">Deposit Settings</h2>
                        </div>
                        <p className="text-gray-600">Configure deposit amount for bid participation</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <div className="max-w-full mx-auto">
                            {/* Main Deposit Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-900 to-purple-950 px-6 py-4">
                                    <h3 className="text-lg font-semibold text-white">Bid Deposit Configuration</h3>
                                    <p className="text-gray-300 text-sm">This deposit is charged once per auction on first bid</p>
                                </div>

                                {/* Current Rate Display */}
                                <div className="p-6 border-b border-gray-200 bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Current Deposit</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold">{getDisplayValue()}</span>
                                                <span className="text-gray-500 text-sm">
                                                    {settings.depositType === 'fixed' ? 'fixed amount' : 'of bid amount'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-full ${settings.depositType === 'fixed'
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'bg-indigo-100 text-indigo-500'
                                            }`}>
                                            {settings.depositType === 'fixed'
                                                ? <DollarSign size={28} />
                                                : <Percent size={28} />
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* Settings Form */}
                                <div className="p-6 space-y-6">
                                    {/* Status Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-700">Enable Deposits</p>
                                            <p className="text-sm text-gray-500">Turn bid deposits on/off globally</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.isActive}
                                                onChange={handleToggleDeposit}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>

                                    {/* Deposit Type Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Deposit Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleDepositTypeChange('fixed')}
                                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${settings.depositType === 'fixed'
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <DollarSign size={20} />
                                                <span className="font-medium">Fixed Amount</span>
                                            </button>
                                            <button
                                                onClick={() => handleDepositTypeChange('percentage')}
                                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${settings.depositType === 'percentage'
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Percent size={20} />
                                                <span className="font-medium">Percentage</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Deposit Value Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {settings.depositType === 'fixed' ? 'Deposit Amount ($)' : 'Deposit Percentage (%)'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max={settings.depositType === 'percentage' ? 100 : undefined}
                                                step={settings.depositType === 'percentage' ? "0.1" : "1"}
                                                value={settings.depositValue}
                                                onChange={(e) => handleDepositValueChange(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
                                                disabled={!settings.isActive}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                                                {settings.depositType === 'fixed' ? '$' : '%'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Min/Max Deposit Limits (for percentage type) */}
                                    {settings.depositType === 'percentage' && (
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Minimum Deposit ($)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={settings.minDepositAmount}
                                                        onChange={(e) => handleMinDepositChange(e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                                        disabled={!settings.isActive}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Minimum deposit amount</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Maximum Deposit ($)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={settings.maxDepositAmount || ''}
                                                        onChange={(e) => handleMaxDepositChange(e.target.value)}
                                                        placeholder="No limit"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                                        disabled={!settings.isActive}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Last Updated Info */}
                                    {settings.updatedAt && (
                                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                            <p>Last updated: {new Date(settings.updatedAt).toLocaleString()}</p>
                                            {settings.updatedBy && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {/* Updated by: {settings.updatedBy} */}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Save Button */}
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Save Deposit Settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </AdminContainer>
            </div>
        </section>
    );
};

export default DepositSettings;