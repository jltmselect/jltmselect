import { useEffect, useState } from "react";

const BundleItemModal = ({
    isOpen,
    onClose,
    onSave,
    categoryFields,
    initialData = null
}) => {
    const [localFormData, setLocalFormData] = useState({
        quantity: 1,
        specifications: {},
        notes: ""
    });
    const [fieldErrors, setFieldErrors] = useState({});

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // EDIT MODE: Pre-fill with existing data
                setLocalFormData({
                    quantity: initialData.quantity || 1,
                    specifications: initialData.specifications || {},
                    notes: initialData.notes || ""
                });
            } else {
                // ADD MODE: Reset to empty
                setLocalFormData({
                    quantity: 1,
                    specifications: {},
                    notes: ""
                });
            }
            // Clear any previous errors
            setFieldErrors({});
        }
    }, [isOpen, initialData]);

    const handleFieldChange = (fieldName, value) => {
        setLocalFormData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [fieldName]: value
            }
        }));
        // Clear error for this field when user types
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        categoryFields.forEach(field => {
            if (field.required && !localFormData.specifications[field.name]) {
                errors[field.name] = `${field.label} is required`;
            }
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(localFormData);
            // Don't close here - let parent handle closing after successful save
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                    {initialData ? 'Edit Bundle Item' : 'Add Item to Bundle'}
                </h3>

                <div className="space-y-4">
                    {/* Quantity Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity <span className="text-gray-500 text-xs">(if multiple identical items)</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={localFormData.quantity}
                            onChange={(e) => setLocalFormData({
                                ...localFormData,
                                quantity: parseInt(e.target.value) || 1
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>

                    {/* Dynamic Fields */}
                    <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium mb-3">Item Specifications</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoryFields.sort((a, b) => a.order - b.order).map(field => (
                                <div key={field.name} className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                        {field.unit && ` (${field.unit})`}
                                    </label>

                                    {field.fieldType === 'select' ? (
                                        <select
                                            value={localFormData.specifications[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className={`w-full p-2 border ${fieldErrors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.fieldType === 'textarea' ? (
                                        <textarea
                                            value={localFormData.specifications[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            rows={3}
                                            className={`w-full p-2 border ${fieldErrors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                        />
                                    ) : field.fieldType === 'number' ? (
                                        <input
                                            type="number"
                                            value={localFormData.specifications[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className={`w-full p-2 border ${fieldErrors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={localFormData.specifications[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className={`w-full p-2 border ${fieldErrors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
                                        />
                                    )}

                                    {fieldErrors[field.name] && (
                                        <p className="text-xs text-red-500">{fieldErrors[field.name]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes Field */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={localFormData.notes}
                            onChange={(e) => setLocalFormData({ ...localFormData, notes: e.target.value })}
                            rows={2}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Any additional notes about this item..."
                        />
                    </div> */}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        {initialData ? 'Update Item' : 'Add to Bundle'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BundleItemModal;