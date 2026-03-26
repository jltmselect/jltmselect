import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    FileText,
    DollarSign,
    Settings,
    CheckCircle,
    ArrowLeft,
    ArrowRight,
    X,
    Image,
    File,
    Clock,
    MapPin,
    Gavel,
    Youtube,
    Car,
    Cog,
    Trophy,
    Move,
    Fuel,
    Gauge,
    Calendar,
    User,
    ChevronDown,
    ChevronRight,
    AlertCircle,
    Banknote,
    Zap,
    Package,
    Plus,
    Edit,
    Trash2
} from "lucide-react";
import { RTE, SellerContainer, SellerHeader, SellerSidebar, BundleItemModal, BundleTableRow } from '../../components';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance.js';
import { useNavigate } from 'react-router-dom';

// Drag and Drop item types
const ItemTypes = {
    PHOTO: 'photo',
    BUNDLE_ITEM: 'bundleItem',
};

// Draggable Photo Component (keep your existing implementation)
const DraggablePhoto = ({ photo, index, movePhoto, removePhoto }) => {
    const [, ref] = useDrag({
        type: ItemTypes.PHOTO,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.PHOTO,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                movePhoto(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))} className="relative group">
            <img
                src={URL.createObjectURL(photo)}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-move"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                <Move size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
            </div>
            <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
};

// Photo Gallery Component
const PhotoGallery = ({ photos, movePhoto, removePhoto }) => {
    return (
        <div className="mt-4">
            <p className="text-sm text-secondary mb-3">
                Drag and drop to reorder photos. The first image will be the main thumbnail.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((photo, index) => (
                    <DraggablePhoto
                        key={`photo-${index}`}
                        photo={photo}
                        index={index}
                        movePhoto={movePhoto}
                        removePhoto={removePhoto}
                    />
                ))}
            </div>
        </div>
    );
};

// UploadProgressModal Component
const UploadProgressModal = ({ isOpen, fileCount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mr-3"></div>
                    <h3 className="text-lg font-semibold">Creating Your Auction</h3>
                </div>

                <div className="space-y-3">
                    <p className="text-gray-600">
                        We're uploading {fileCount} file(s) to our secure cloud storage.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            ⏳ <strong>Please be patient:</strong> Large files may take several minutes to upload depending on your internet speed.
                        </p>
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Do not close this window until the process is complete.
                    </p>
                </div>
            </div>
        </div>
    );
};

const CreateAuction = () => {
    const [step, setStep] = useState(1);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Category state
    const [parentCategories, setParentCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);
    const [categoryFields, setCategoryFields] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Bundle items state
    const [bundleItems, setBundleItems] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        trigger,
        getValues,
        reset,
        control,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            auctionType: 'standard',
            categories: [],
            parcel: {
                weight: '',
                length: '',
                width: '',
                height: '',
                distanceUnit: 'in',
                massUnit: 'lb'
            }
        }
    });

    const auctionType = watch('auctionType');
    const startDate = watch('startDate');
    const endDate = watch('endDate');
    const selectedCategory = watch('category');
    const selectedParentSlug = watch('parentCategory');
    const massUnit = watch('parcel.massUnit');
    const distanceUnit = watch('parcel.distanceUnit');

    // Fetch parent categories on mount
    useEffect(() => {
        fetchParentCategories();
    }, []);

    // Fetch subcategories when parent is selected
    useEffect(() => {
        if (selectedParentSlug) {
            fetchSubCategories(selectedParentSlug);
            setValue('category', '');
            setCategoryFields([]);
            setBundleItems([]); // Clear bundle items when category changes
        }
    }, [selectedParentSlug]);

    // Fetch fields when subcategory is selected
    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryFields(selectedCategory);
            setBundleItems([]); // Clear bundle items when subcategory changes
        } else {
            setCategoryFields([]);
        }
    }, [selectedCategory]);

    // Fetch parent categories
    const fetchParentCategories = async () => {
        try {
            setLoadingCategories(true);
            const { data } = await axiosInstance.get('/api/v1/categories/public/parents');
            if (data.success) {
                setParentCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching parent categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch subcategories by parent slug
    const fetchSubCategories = async (parentSlug) => {
        try {
            setLoadingCategories(true);
            const { data } = await axiosInstance.get(`/api/v1/categories/public/${parentSlug}/children`);
            if (data.success) {
                setSubCategories(data.data.subcategories);
                setSelectedParent(data.data.parent);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            toast.error('Failed to load subcategories');
            setSubCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch category fields by slug
    const fetchCategoryFields = async (slug) => {
        try {
            setLoadingFields(true);
            const { data } = await axiosInstance.get(`/api/v1/categories/public/by-slug/${slug}/fields`);
            if (data.success) {
                setCategoryFields(data.data.fields || []);
            }
        } catch (error) {
            console.error('Error fetching category fields:', error);
            toast.error('Failed to load category fields');
            setCategoryFields([]);
        } finally {
            setLoadingFields(false);
        }
    };

    // Photo handlers
    const movePhoto = (fromIndex, toIndex) => {
        const updatedPhotos = [...uploadedPhotos];
        const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
        updatedPhotos.splice(toIndex, 0, movedPhoto);
        setUploadedPhotos(updatedPhotos);
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadedPhotos([...files, ...uploadedPhotos]);
        clearErrors('photos');
    };

    const removePhoto = (index) => {
        const newPhotos = uploadedPhotos.filter((_, i) => i !== index);
        setUploadedPhotos(newPhotos);
        if (newPhotos.length === 0) {
            setError('photos', {
                type: 'manual',
                message: 'At least one photo is required'
            });
        } else {
            clearErrors('photos');
        }
    };

    // Document handlers
    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadedDocuments([...uploadedDocuments, ...files]);
    };

    const removeDocument = (index) => {
        setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
    };

    // Bundle item handlers
    const addBundleItem = (itemData) => {
        setBundleItems([...bundleItems, itemData]);
        setShowItemModal(false);
        setEditingItemIndex(null);
    };

    const updateBundleItem = (index, itemData) => {
        const updated = [...bundleItems];
        updated[index] = itemData;
        setBundleItems(updated);
        setShowItemModal(false);
        setEditingItemIndex(null);
    };

    const removeBundleItem = (index) => {
        setBundleItems(bundleItems.filter((_, i) => i !== index));
    };

    const moveBundleItem = (fromIndex, toIndex) => {
        const updated = [...bundleItems];
        const [moved] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, moved);
        setBundleItems(updated);
    };

    const handleEditItem = (index) => {
        setEditingItemIndex(index);
        setShowItemModal(true);
    };

    // Validation for step 1
    const validateStep1 = async () => {
        const fieldsToValidate = [
            'title',
            'description',
            'startDate',
            'endDate',
            'parentCategory',
            'category'
        ];

        const overallValidationPassed = await trigger(fieldsToValidate);

        if (!overallValidationPassed) {
            return false;
        }

        if (uploadedPhotos.length === 0) {
            setError('photos', {
                type: 'manual',
                message: 'At least one photo is required'
            });
            return false;
        }

        if (bundleItems.length === 0) {
            toast.error('Please add at least one item to the bundle');
            return false;
        }

        return true;
    };

    // Validation for step 2
    const validateStep2 = async () => {
        const fieldsToValidate = ['auctionType'];

        if (auctionType === 'standard' || auctionType === 'reserve') {
            fieldsToValidate.push('startPrice', 'bidIncrement');
        }

        if (auctionType === 'reserve') {
            fieldsToValidate.push('reservePrice');
        }

        if (auctionType === 'buy_now') {
            fieldsToValidate.push('buyNowPrice', 'startPrice');
        }

        return await trigger(fieldsToValidate);
    };

    const nextStep = async () => {
        let isValid = true;

        scrollTo({ top: 0, behavior: 'smooth' });

        if (step === 1) {
            isValid = await validateStep1();
        } else if (step === 2) {
            isValid = await validateStep2();
        }

        if (isValid) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Create auction handler
    const createAuctionHandler = async (auctionData) => {
        try {
            setIsLoading(true);

            const formData = new FormData();

            // Basic Info
            formData.append('title', auctionData.title);
            formData.append('description', auctionData.description);
            formData.append('location', auctionData.location || '');
            formData.append('videoLink', auctionData.video || '');

            // Categories
            const categoriesToStore = [];
            if (auctionData.parentCategory) {
                categoriesToStore.push(auctionData.parentCategory);
            }
            if (auctionData.category) {
                categoriesToStore.push(auctionData.category);
            }
            formData.append('categories', JSON.stringify(categoriesToStore));

            // Auction settings
            formData.append('auctionType', auctionData.auctionType);
            formData.append('allowOffers', auctionData.allowOffers || false);
            formData.append('features', auctionData.features || '');
            formData.append('startDate', new Date(auctionData.startDate).toISOString());
            formData.append('endDate', new Date(auctionData.endDate).toISOString());

            // Bundle Items - This is the key part
            formData.append('bundleItems', JSON.stringify(bundleItems.map(item => ({
                quantity: item.quantity,
                specifications: item.specifications,
                notes: item.notes || ''
            }))));

            if (auctionData.parcel) {
                formData.append('parcel', JSON.stringify({
                    weight: auctionData.parcel.weight,
                    length: auctionData.parcel.length,
                    width: auctionData.parcel.width,
                    height: auctionData.parcel.height,
                    distanceUnit: auctionData.parcel.distanceUnit,
                    massUnit: auctionData.parcel.massUnit
                }));
            }

            // Pricing
            if (auctionData.auctionType === 'giveaway' || auctionData.auctionType === 'buy_now') {
                formData.append('startPrice', 0);
                if (auctionData.reservePrice) {
                    formData.append('reservePrice', null);
                }
                if (auctionData.auctionType === 'buy_now' && auctionData.buyNowPrice) {
                    formData.append('buyNowPrice', auctionData.buyNowPrice);
                }
                if (auctionData.auctionType === 'buy_now' && auctionData.bidIncrement) {
                    formData.append('bidIncrement', auctionData.bidIncrement);
                }
            } else {
                if (auctionData.startPrice) {
                    formData.append('startPrice', auctionData.startPrice);
                }
                if (auctionData.auctionType === 'standard' || auctionData.auctionType === 'reserve') {
                    formData.append('bidIncrement', auctionData.bidIncrement);

                    if (auctionData.buyNowPrice) {
                        formData.append('buyNowPrice', null);
                    }
                }
                if (auctionData.auctionType === 'reserve' && auctionData.reservePrice) {
                    formData.append('reservePrice', auctionData.reservePrice);
                }
            }

            // Append photos
            uploadedPhotos.forEach((photo) => {
                formData.append('photos', photo);
            });

            // Append documents
            uploadedDocuments.forEach((doc) => {
                formData.append('documents', doc);
            });

            const { data } = await axiosInstance.post(
                '/api/v1/auctions/create',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (data && data.success) {
                toast.success(data.message);
                // Reset form
                setStep(1);
                setUploadedPhotos([]);
                setUploadedDocuments([]);
                setBundleItems([]);
                setCategoryFields([]);
                setSubCategories([]);
                setSelectedParent(null);
                reset();
                navigate('/seller/auctions/all');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Failed to create auction';
            toast.error(errorMessage);
            console.log('Create auction error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <section className="flex min-h-[70vh]">
                <SellerSidebar />
                <UploadProgressModal
                    isOpen={isLoading}
                    fileCount={uploadedPhotos.length + uploadedDocuments.length}
                />

                <div className="w-full relative">
                    <SellerHeader />

                    <SellerContainer>
                        <div className="pt-16 md:py-7">
                            <h1 className="text-3xl md:text-4xl font-bold mb-5">Create Auction</h1>

                            {/* Progress Steps */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    {['Item Info', 'Pricing & Bidding', 'Review & Submit'].map((label, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step > index + 1 ? 'bg-green-500 text-white' :
                                                step === index + 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {step > index + 1 ? <CheckCircle size={20} /> : index + 1}
                                            </div>
                                            <span className="text-sm mt-2 hidden md:block">{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full bg-gray-200 h-3 rounded-full">
                                    <div
                                        className="bg-black h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${(step / 3) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(createAuctionHandler)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                {/* Step 1: Item Information */}
                                {step === 1 && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                                            <Package size={20} className="mr-2" />
                                            Bundle Details
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                                                    Bundle Name *
                                                </label>
                                                <input
                                                    {...register('title', { required: 'Bundle name is required' })}
                                                    id="title"
                                                    type="text"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    placeholder="e.g., Summer T-shirt Bundle (10 pcs)"
                                                />
                                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                            </div>

                                            {/* Category Selection */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label htmlFor="parentCategory" className="block text-sm font-medium text-secondary mb-1">
                                                        Category *
                                                    </label>
                                                    <select
                                                        {...register('parentCategory', {
                                                            required: 'Please select a category'
                                                        })}
                                                        id="parentCategory"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        disabled={loadingCategories}
                                                    >
                                                        <option value="">Select a category</option>
                                                        {parentCategories.map(cat => (
                                                            <option key={cat._id} value={cat.slug}>
                                                                {cat.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.parentCategory && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.parentCategory.message}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="category" className="block text-sm font-medium text-secondary mb-1">
                                                        Subcategory *
                                                    </label>
                                                    <select
                                                        {...register('category', {
                                                            required: 'Please select a subcategory'
                                                        })}
                                                        id="category"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        disabled={!selectedParentSlug || loadingCategories}
                                                    >
                                                        <option value="">Select a subcategory</option>
                                                        {subCategories.map(sub => (
                                                            <option key={sub._id} value={sub.slug}>
                                                                {sub.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.category && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bundle Items Builder */}
                                        {selectedCategory && categoryFields.length > 0 && (
                                            <div className="mb-8 border rounded-lg overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold flex items-center gap-2">
                                                            <Package size={18} />
                                                            Bundle Contents ({bundleItems.length} items)
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            Add all items included in this bundle
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingItemIndex(null);
                                                            setShowItemModal(true);
                                                        }}
                                                        className="flex items-center gap-1 px-3 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                                                    >
                                                        <Plus size={16} />
                                                        Add Item
                                                    </button>
                                                </div>

                                                {bundleItems.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-gray-50 border-b">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left w-10"></th>
                                                                    <th className="px-4 py-2 text-left">#</th>
                                                                    <th className="px-4 py-2 text-left">Qty</th>
                                                                    {categoryFields.sort((a, b) => a.order - b.order).map(field => (
                                                                        <th key={field.name} className="px-4 py-2 text-left">
                                                                            {field.label}
                                                                        </th>
                                                                    ))}
                                                                    <th className="px-4 py-2 text-left">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {bundleItems.map((item, index) => (
                                                                    <BundleTableRow
                                                                        key={index}
                                                                        item={item}
                                                                        index={index}
                                                                        categoryFields={categoryFields}
                                                                        onEdit={handleEditItem}
                                                                        onRemove={removeBundleItem}
                                                                        moveItem={moveBundleItem}
                                                                    />
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <Package size={40} className="mx-auto mb-2 text-gray-300" />
                                                        <p>No items added to bundle yet</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingItemIndex(null);
                                                                setShowItemModal(true);
                                                            }}
                                                            className="mt-2 text-black underline"
                                                        >
                                                            Add your first item
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Item Modal */}
                                        <BundleItemModal
                                            isOpen={showItemModal}
                                            onClose={() => {
                                                setShowItemModal(false);
                                                setEditingItemIndex(null);
                                            }}
                                            onSave={(itemData) => {
                                                if (editingItemIndex !== null) {
                                                    updateBundleItem(editingItemIndex, itemData);
                                                } else {
                                                    addBundleItem(itemData);
                                                }
                                            }}
                                            categoryFields={categoryFields}
                                            initialData={editingItemIndex !== null ? bundleItems[editingItemIndex] : null}
                                        />

                                        {/* Parcel Details Section - Add this after video link field */}
                                        <div className="border-t border-gray-200 pt-6 mb-6">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                <Package size={20} className="mr-2" />
                                                Parcel Details
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {/* Mass Unit */}
                                                <div>
                                                    <label htmlFor="massUnit" className="block text-sm font-medium text-secondary mb-1">
                                                        Mass Unit
                                                    </label>
                                                    <select
                                                        {...register('parcel.massUnit')}
                                                        id="massUnit"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    >
                                                        <option value="lb">lb</option>
                                                        <option value="kg">kg</option>
                                                        <option value="g">g</option>
                                                        <option value="oz">oz</option>
                                                    </select>
                                                </div>

                                                {/* Distance Unit */}
                                                <div>
                                                    <label htmlFor="distanceUnit" className="block text-sm font-medium text-secondary mb-1">
                                                        Distance Unit
                                                    </label>
                                                    <select
                                                        {...register('parcel.distanceUnit')}
                                                        id="distanceUnit"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    >
                                                        <option value="in">in</option>
                                                        <option value="cm">cm</option>
                                                        <option value="mm">mm</option>
                                                        <option value="m">m</option>
                                                        <option value="ft">ft</option>
                                                    </select>
                                                </div>

                                                {/* Weight with its own unit dropdown */}
                                                <div>
                                                    <label htmlFor="weight" className="block text-sm font-medium text-secondary mb-1">
                                                        Weight ({massUnit})
                                                    </label>
                                                    <input
                                                        {...register('parcel.weight', {
                                                            min: { value: 0, message: 'Weight must be positive' }
                                                        })}
                                                        id="weight"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        placeholder="0.00"
                                                    />
                                                    {errors.parcel?.weight && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.parcel.weight.message}</p>
                                                    )}
                                                </div>

                                                {/* Length with its own unit dropdown */}
                                                <div>
                                                    <label htmlFor="length" className="block text-sm font-medium text-secondary mb-1">
                                                        Length ({distanceUnit})
                                                    </label>
                                                    <input
                                                        {...register('parcel.length', {
                                                            min: { value: 0, message: 'Length must be positive' }
                                                        })}
                                                        id="length"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        placeholder="0.00"
                                                    />
                                                    {errors.parcel?.length && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.parcel.length.message}</p>
                                                    )}
                                                </div>

                                                {/* Width */}
                                                <div>
                                                    <label htmlFor="width" className="block text-sm font-medium text-secondary mb-1">
                                                        Width ({distanceUnit})
                                                    </label>
                                                    <input
                                                        {...register('parcel.width', {
                                                            min: { value: 0, message: 'Width must be positive' }
                                                        })}
                                                        id="width"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        placeholder="0.00"
                                                    />
                                                    {errors.parcel?.width && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.parcel.width.message}</p>
                                                    )}
                                                </div>

                                                {/* Height */}
                                                <div>
                                                    <label htmlFor="height" className="block text-sm font-medium text-secondary mb-1">
                                                        Height ({distanceUnit})
                                                    </label>
                                                    <input
                                                        {...register('parcel.height', {
                                                            min: { value: 0, message: 'Height must be positive' }
                                                        })}
                                                        id="height"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        placeholder="0.00"
                                                    />
                                                    {errors.parcel?.height && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.parcel.height.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-xs text-gray-500 mt-2">
                                                Provide package dimensions for shipping cost calculation. Fields are optional.
                                            </p>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">
                                                Bundle Description *
                                            </label>
                                            <RTE
                                                name="description"
                                                control={control}
                                                label="Description:"
                                                defaultValue={getValues('description') || ''}
                                                placeholder="Describe the bundle, highlight key pieces, condition notes..."
                                            />
                                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-secondary mb-1">
                                                    Location
                                                </label>
                                                <div className="relative">
                                                    <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        {...register('location')}
                                                        id="location"
                                                        type="text"
                                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        placeholder="e.g., New York, NY"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="video" className="block text-sm font-medium text-secondary mb-1">
                                                    Video Link
                                                </label>
                                                <div className="relative">
                                                    <Youtube size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        {...register('video', {
                                                            pattern: {
                                                                value: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                                                                message: 'Please enter a valid YouTube URL'
                                                            }
                                                        })}
                                                        id="video"
                                                        type="url"
                                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        placeholder="YouTube video URL (bundle overview)"
                                                    />
                                                </div>
                                                {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="startDate" className="block text-sm font-medium text-secondary mb-1">
                                                    Start Date & Time *
                                                </label>
                                                <div className="relative">
                                                    <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        {...register('startDate', { required: 'Start date is required' })}
                                                        id="startDate"
                                                        type="datetime-local"
                                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="endDate" className="block text-sm font-medium text-secondary mb-1">
                                                    End Date & Time *
                                                </label>
                                                <div className="relative">
                                                    <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        {...register('endDate', {
                                                            required: 'End date is required',
                                                            validate: {
                                                                afterStartDate: value => {
                                                                    const start = new Date(watch('startDate'));
                                                                    const end = new Date(value);
                                                                    return end > start || 'End date must be after start date';
                                                                }
                                                            }
                                                        })}
                                                        id="endDate"
                                                        type="datetime-local"
                                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="photo-upload" className="block text-sm font-medium text-secondary mb-1">
                                                Attach Photos *
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                    className="hidden"
                                                    id="photo-upload"
                                                />
                                                <label htmlFor="photo-upload" className="cursor-pointer">
                                                    <Image size={40} className="mx-auto text-gray-400 mb-2" />
                                                    <p className="text-gray-600">Browse photo(s) to upload</p>
                                                    <p className="text-sm text-secondary">Bundle photos, group shots, detail shots</p>
                                                </label>
                                            </div>
                                            {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos.message}</p>}

                                            {uploadedPhotos.length > 0 && (
                                                <PhotoGallery
                                                    photos={uploadedPhotos}
                                                    movePhoto={movePhoto}
                                                    removePhoto={removePhoto}
                                                />
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="document-upload" className="block text-sm font-medium text-secondary mb-1">
                                                Attach Documents
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleDocumentUpload}
                                                    className="hidden"
                                                    id="document-upload"
                                                />
                                                <label htmlFor="document-upload" className="cursor-pointer">
                                                    <File size={40} className="mx-auto text-gray-400 mb-2" />
                                                    <p className="text-gray-600">Browse document(s) to upload</p>
                                                    <p className="text-sm text-secondary">Authentication certificates, receipts, etc.</p>
                                                </label>
                                            </div>

                                            {uploadedDocuments.length > 0 && (
                                                <div className="mt-4 space-y-2">
                                                    {uploadedDocuments.map((doc, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                            <span className="text-sm truncate">{doc.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDocument(index)}
                                                                className="text-red-500"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Pricing & Bidding */}
                                {step === 2 && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                                            <Banknote size={20} className="mr-2" />
                                            Pricing & Bidding
                                        </h2>

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-secondary mb-1">Auction Type *</label>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                {[
                                                    { value: 'standard', label: 'Standard Auction' },
                                                    { value: 'reserve', label: 'Reserve Price Auction' },
                                                    { value: 'buy_now', label: 'Buy Now Auction' },
                                                ].map((type) => (
                                                    <label key={type.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                                        <input
                                                            type="radio"
                                                            {...register('auctionType', { required: 'Auction type is required' })}
                                                            value={type.value}
                                                            className="mr-3"
                                                        />
                                                        <span>{type.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.auctionType && <p className="text-red-500 text-sm mt-1">{errors.auctionType.message}</p>}
                                        </div>

                                        {(watch('auctionType') === 'buy_now' || watch('auctionType') === 'giveaway') && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                                <p className="text-green-700 flex items-center gap-2">
                                                    <Zap size={18} />
                                                    <span>This auction will start immediately upon creation.</span>
                                                </p>
                                            </div>
                                        )}

                                        {watch('auctionType') !== 'giveaway' && (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    {(watch('auctionType') === 'standard' || watch('auctionType') === 'reserve') && (
                                                        <div>
                                                            <label htmlFor="startPrice" className="block text-sm font-medium text-secondary mb-1">Start Price *</label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                                                                <input
                                                                    {...register('startPrice', {
                                                                        required: watch('auctionType') !== 'giveaway' ? 'Start price is required' : false,
                                                                        min: { value: 0, message: 'Price must be positive' }
                                                                    })}
                                                                    id="startPrice"
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                            {errors.startPrice && <p className="text-red-500 text-sm mt-1">{errors.startPrice.message}</p>}
                                                        </div>
                                                    )}

                                                    {(watch('auctionType') === 'standard' || watch('auctionType') === 'reserve') && (
                                                        <div>
                                                            <label htmlFor="bidIncrement" className="block text-sm font-medium text-secondary mb-1">Bid Increment *</label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                                                                <input
                                                                    {...register('bidIncrement', {
                                                                        required: (watch('auctionType') === 'standard' || watch('auctionType') === 'reserve') ? 'Bid increment is required' : false,
                                                                        min: { value: 0, message: 'Increment must be positive' }
                                                                    })}
                                                                    id="bidIncrement"
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0"
                                                                    className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                            {errors.bidIncrement && <p className="text-red-500 text-sm mt-1">{errors.bidIncrement.message}</p>}
                                                        </div>
                                                    )}
                                                </div>

                                                {watch('auctionType') === 'reserve' && (
                                                    <div className="mb-6">
                                                        <label htmlFor="reservePrice" className="block text-sm font-medium text-secondary mb-1">Reserve Price *</label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                                                            <input
                                                                {...register('reservePrice', {
                                                                    required: watch('auctionType') === 'reserve' ? 'Reserve price is required' : false,
                                                                    min: { value: 0, message: 'Price must be positive' },
                                                                    validate: value => {
                                                                        const startPrice = parseFloat(watch('startPrice') || 0);
                                                                        const reservePrice = parseFloat(value);
                                                                        return reservePrice >= startPrice || 'Reserve price must be greater than or equal to start price';
                                                                    }
                                                                })}
                                                                id="reservePrice"
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                        {errors.reservePrice && <p className="text-red-500 text-sm mt-1">{errors.reservePrice.message}</p>}
                                                        <p className="text-sm text-secondary mt-1">Bundle will not sell if bids don't reach this price</p>
                                                    </div>
                                                )}

                                                {watch('auctionType') === 'buy_now' && (
                                                    <div className="mb-4">
                                                        <label htmlFor="buyNowPrice" className="block text-sm font-medium text-secondary mb-1">
                                                            Buy Now Price *
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">$</span>
                                                            <input
                                                                {...register('buyNowPrice', {
                                                                    required: watch('auctionType') === 'buy_now' ? 'Buy Now price is required' : false,
                                                                    min: { value: 0, message: 'Price must be positive' },
                                                                    validate: value => {
                                                                        const startPrice = parseFloat(watch('startPrice') || 0);
                                                                        const buyNowPrice = parseFloat(value);
                                                                        return buyNowPrice >= startPrice || 'Buy Now price must be greater than or equal to start price';
                                                                    }
                                                                })}
                                                                id="buyNowPrice"
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                className="w-full pl-8 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                        {errors.buyNowPrice && <p className="text-red-500 text-sm mt-1">{errors.buyNowPrice.message}</p>}
                                                        <p className="text-sm text-secondary mt-1">
                                                            Buyers can purchase the entire bundle immediately at this price
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mb-6">
                                                    <label className="flex items-center cursor-pointer">
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                {...register('allowOffers')}
                                                                id="allowOffers"
                                                                className="sr-only"
                                                            />
                                                            <div className={`block w-14 h-8 rounded-full ${watch('allowOffers') ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${watch('allowOffers') ? 'transform translate-x-6' : ''}`}></div>
                                                        </div>
                                                        <div className="ml-3">
                                                            <span className="font-medium text-secondary">Allow Offers on Bundle</span>
                                                            <p className="text-sm text-secondary mt-1">
                                                                Enable buyers to make purchase offers for the entire bundle
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        {watch('auctionType') === 'giveaway' && (
                                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
                                                <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2">
                                                    <span>🎁 Free Giveaway Bundle</span>
                                                </h3>
                                                <p className="text-green-600 mb-2">
                                                    This bundle will be given away for free. The first user who clicks "Claim" will win it immediately.
                                                </p>
                                                <p className="text-sm text-green-500">
                                                    No pricing needed. The auction will end as soon as someone claims it.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Step 3: Review & Submit */}
                                {step === 3 && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                                            <Settings size={20} className="mr-2" />
                                            Review & Submit
                                        </h2>

                                        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                                            <h3 className="font-medium text-lg mb-4 border-b pb-2">Bundle Summary</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Bundle Details */}
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h4 className="font-medium mb-3">Bundle Details</h4>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-xs text-secondary">Bundle Name</p>
                                                                <p className="font-medium">{watch('title') || 'Not provided'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-secondary">Category</p>
                                                                <p className="font-medium">
                                                                    {selectedParent?.name}
                                                                    {selectedCategory && ` / ${subCategories.find(s => s.slug === selectedCategory)?.name || selectedCategory}`}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-secondary">Total Items</p>
                                                                <p className="font-medium">
                                                                    {bundleItems.reduce((sum, item) => sum + (item.quantity || 1), 0)} pieces
                                                                    ({bundleItems.length} unique items)
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-secondary">Location</p>
                                                                <p className="font-medium">{watch('location') || 'Not specified'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Bundle Items Preview */}
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h4 className="font-medium mb-3">Bundle Contents</h4>
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-xs">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-2 py-1 text-left">#</th>
                                                                        <th className="px-2 py-1 text-left">Qty</th>
                                                                        {categoryFields.slice(0, 4).map(field => (
                                                                            <th key={field.name} className="px-2 py-1 text-left">
                                                                                {field.label}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {bundleItems.slice(0, 5).map((item, idx) => (
                                                                        <tr key={idx} className="border-t">
                                                                            <td className="px-2 py-1">{idx + 1}</td>
                                                                            <td className="px-2 py-1">{item.quantity}</td>
                                                                            {categoryFields.slice(0, 4).map(field => (
                                                                                <td key={field.name} className="px-2 py-1">
                                                                                    {item.specifications?.[field.name] || '-'}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                    {bundleItems.length > 5 && (
                                                                        <tr>
                                                                            <td colSpan={6} className="px-2 py-1 text-gray-500 italic">
                                                                                ... and {bundleItems.length - 5} more items
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Auction Details */}
                                                <div className="space-y-4">
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h4 className="font-medium mb-3">Auction Details</h4>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <p className="text-xs text-secondary">Auction Type</p>
                                                                <p className="font-medium">
                                                                    {watch('auctionType') === 'buy_now' && 'Buy Now Auction'}
                                                                    {watch('auctionType') === 'standard' && 'Standard Auction'}
                                                                    {watch('auctionType') === 'reserve' && 'Reserve Auction'}
                                                                    {watch('auctionType') === 'giveaway' && 'Free Giveaway'}
                                                                </p>
                                                            </div>
                                                            {watch('allowOffers') && (
                                                                <div>
                                                                    <p className="text-xs text-secondary">Allow Offers</p>
                                                                    <p className="font-medium text-green-600">Yes</p>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-xs text-secondary">Start Date</p>
                                                                <p className="font-medium">
                                                                    {watch('startDate') ? new Date(watch('startDate')).toLocaleString() : 'Not provided'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-secondary">End Date</p>
                                                                <p className="font-medium">
                                                                    {watch('endDate') ? new Date(watch('endDate')).toLocaleString() : 'Not provided'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Media */}
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h4 className="font-medium mb-3">Media</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-xs text-secondary">Photos</p>
                                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                    {uploadedPhotos.length} uploaded
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-xs text-secondary">Documents</p>
                                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                    {uploadedDocuments.length} uploaded
                                                                </span>
                                                            </div>
                                                            {watch('video') && (
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-xs text-secondary">Video</p>
                                                                    <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                        Included
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Pricing */}
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h4 className="font-medium mb-3">Pricing</h4>
                                                        <div className="space-y-2">
                                                            {watch('auctionType') !== 'giveaway' && (
                                                                <>
                                                                    <div>
                                                                        <p className="text-xs text-secondary">Start Price</p>
                                                                        <p className="font-medium">${watch('startPrice') || '0.00'}</p>
                                                                    </div>
                                                                    {watch('auctionType') === 'buy_now' && (
                                                                        <div>
                                                                            <p className="text-xs text-secondary">Buy Now Price</p>
                                                                            <p className="font-medium text-blue-600">${watch('buyNowPrice') || '0.00'}</p>
                                                                        </div>
                                                                    )}
                                                                    {watch('bidIncrement') > 0 && (
                                                                        <div>
                                                                            <p className="text-xs text-secondary">Bid Increment</p>
                                                                            <p className="font-medium">${watch('bidIncrement')}</p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                            {watch('auctionType') === 'giveaway' && (
                                                                <p className="text-green-600 font-medium">Free Giveaway</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Parcel Details Preview - Add this here */}
                                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                                        <h4 className="font-medium mb-3 flex items-center gap-2">
                                                            <Package size={18} />
                                                            Parcel Details
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {watch('parcel.weight') && (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <p className="text-xs text-secondary">Weight</p>
                                                                    <p className="font-medium text-sm">
                                                                        {watch('parcel.weight')} {watch('parcel.massUnit') || 'lb'}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {watch('parcel.length') && watch('parcel.width') && watch('parcel.height') ? (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <p className="text-xs text-secondary">Dimensions</p>
                                                                    <p className="font-medium text-sm">
                                                                        {watch('parcel.length')} × {watch('parcel.width')} × {watch('parcel.height')} {watch('parcel.distanceUnit') || 'in'}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {watch('parcel.length') && (
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <p className="text-xs text-secondary">Length</p>
                                                                            <p className="font-medium text-sm">
                                                                                {watch('parcel.length')} {watch('parcel.distanceUnit') || 'in'}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {watch('parcel.width') && (
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <p className="text-xs text-secondary">Width</p>
                                                                            <p className="font-medium text-sm">
                                                                                {watch('parcel.width')} {watch('parcel.distanceUnit') || 'in'}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {watch('parcel.height') && (
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <p className="text-xs text-secondary">Height</p>
                                                                            <p className="font-medium text-sm">
                                                                                {watch('parcel.height')} {watch('parcel.distanceUnit') || 'in'}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}

                                                            {!watch('parcel.weight') && !watch('parcel.length') && !watch('parcel.width') && !watch('parcel.height') && (
                                                                <p className="text-gray-500 italic text-sm">No parcel details provided</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description Preview */}
                                            <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
                                                <h4 className="font-medium text-black mb-3">Description Preview</h4>
                                                <div className="prose prose-lg max-w-none border rounded-lg p-4 bg-gray-50">
                                                    {watch('description') ? (
                                                        parse(watch('description'))
                                                    ) : (
                                                        <p className="text-gray-500 italic">No description provided</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="termsAgreed" className="flex items-start">
                                                <input
                                                    type="checkbox"
                                                    {...register('termsAgreed', { required: 'You must agree to the terms' })}
                                                    id="termsAgreed"
                                                    className="mt-1 mr-2"
                                                />
                                                <span className="text-sm font-medium text-secondary">
                                                    I agree to the terms and conditions and confirm that I have the right to sell this bundle
                                                </span>
                                            </label>
                                            {errors.termsAgreed && <p className="text-red-500 text-sm mt-1">{errors.termsAgreed.message}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8">
                                    {step > 1 ? (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            <ArrowLeft size={18} className="mr-2" />
                                            Previous
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {step < 3 ? (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                nextStep();
                                            }}
                                            className="flex items-center px-6 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                                        >
                                            Next
                                            <ArrowRight size={18} className="ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="flex items-center px-6 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                                        >
                                            <Gavel size={18} className="mr-2" />
                                            {isLoading ? 'Creating Auction...' : 'Create Auction'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </SellerContainer>
                </div>
            </section>
        </DndProvider>
    );
};

export default CreateAuction;