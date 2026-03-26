import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    FileText,
    Banknote,
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
    Plane,
    Cog,
    Trophy,
    Move,
    Car,
    Calendar,
    AlertCircle,
    Zap,
    Package,
    Plus,
    Edit,
    Trash2
} from "lucide-react";
import { RTE, AdminContainer, AdminHeader, AdminSidebar } from '../../components';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import BundleItemModal from '../../components/BundleItemModal';
import BundleTableRow from '../../components/BundleTableRow';

// Drag and Drop item types
const ItemTypes = {
    PHOTO: 'photo',
    BUNDLE_ITEM: 'bundleItem',
};

// Fixed Draggable Photo Component
const DraggablePhoto = ({ photo, index, movePhoto, removePhoto, caption, onCaptionChange }) => {
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PHOTO,
        item: { type: ItemTypes.PHOTO, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.PHOTO,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            movePhoto(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div className="space-y-2">
            <div
                ref={ref}
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                className="relative group transition-all duration-200"
            >
                <img
                    src={photo.isExisting ? photo.url : URL.createObjectURL(photo.file)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-transparent hover:border-blue-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Move size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                </div>
                <div className="absolute top-2 right-2 bg-blue-500 bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                    {photo.isExisting ? 'Existing' : 'New'}
                </div>
                <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

// Photo Gallery Component
const PhotoGallery = ({ photos, movePhoto, removePhoto, captions, onCaptionChange }) => {
    return (
        <div className="mt-4">
            <p className="text-sm text-secondary mb-3">
                Drag and drop to reorder photos. The first image will be the main thumbnail.
                <span className="block text-xs text-gray-500 mt-1">
                    Blue badge indicates existing photos
                </span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {photos.map((photo, index) => (
                    <DraggablePhoto
                        key={photo.id}
                        photo={photo}
                        index={index}
                        movePhoto={movePhoto}
                        removePhoto={removePhoto}
                        caption={captions[index] || ''}
                        onCaptionChange={onCaptionChange}
                    />
                ))}
            </div>
        </div>
    );
};

// document gallery component
const DocumentGallery = ({ existingDocs, newDocs, removeDoc, existingCaptions, newCaptions, onCaptionChange }) => {
    return (
        <div className="space-y-4">
            {existingDocs.length > 0 && (
                <div>
                    <p className="text-sm text-secondary mb-2">Existing Documents:</p>
                    <div className="space-y-2">
                        {existingDocs.map((doc, index) => (
                            <div key={`existing-doc-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => removeDoc(index, true)}
                                    className="text-red-500 ml-2"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {newDocs.length > 0 && (
                <div>
                    <p className="text-sm text-secondary mb-2">New Documents:</p>
                    <div className="space-y-2">
                        {newDocs.map((doc, index) => (
                            <div key={`new-doc-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <span className="text-sm truncate">{doc.name}</span>
                                    <input
                                        type="text"
                                        placeholder="Add caption..."
                                        value={newCaptions[index] || ''}
                                        onChange={(e) => onCaptionChange('new', index, e.target.value)}
                                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-black"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDoc(index, false)}
                                    className="text-red-500 ml-2"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// UploadProgressModal Component
const UploadProgressModal = ({ isOpen, fileCount, isEdit = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                <div className="flex items-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                    <h3 className="text-lg font-semibold">
                        {isEdit ? 'Updating Your Auction' : 'Creating Your Auction'}
                    </h3>
                </div>

                <div className="space-y-3">
                    <p className="text-gray-600">
                        {fileCount > 0
                            ? `We're uploading ${fileCount} file(s) to our secure cloud storage.`
                            : 'We\'re updating your auction details.'
                        }
                    </p>

                    {fileCount > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                ⏳ <strong>Please be patient:</strong> Large files may take several minutes to upload depending on your internet speed.
                            </p>
                        </div>
                    )}

                    <p className="text-xs text-gray-500 text-center">
                        Do not close this window until the process is complete.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Dynamic Field Renderer Component
const DynamicField = ({ field, register, errors, watch, setValue }) => {
    const fieldName = `specifications.${field.name}`;
    const error = errors.specifications?.[field.name];

    const fieldLabel = field.label || field.name || 'Field';
    const fieldPlaceholder = field.placeholder || `Enter ${fieldLabel.toLowerCase()}`;

    const inputClasses = `w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-black focus:border-transparent`;
    const unitText = field.unit ? ` (${field.unit})` : '';

    const InheritanceBadge = field.source === 'inherited' ? (
        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            Inherited from {field.sourceCategory?.name}
        </span>
    ) : null;

    switch (field.fieldType) {
        case 'textarea':
            return (
                <div className="space-y-2">
                    <div className="flex items-center">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                            {unitText}
                        </label>
                        {InheritanceBadge}
                    </div>
                    <textarea
                        {...register(fieldName, {
                            required: field.required ? `${fieldLabel} is required` : false,
                            minLength: field.validation?.minLength ? {
                                value: field.validation.minLength,
                                message: `Minimum ${field.validation.minLength} characters`
                            } : undefined,
                            maxLength: field.validation?.maxLength ? {
                                value: field.validation.maxLength,
                                message: `Maximum ${field.validation.maxLength} characters`
                            } : undefined,
                            pattern: field.validation?.pattern ? {
                                value: new RegExp(field.validation.pattern),
                                message: field.validation.message || `Invalid format for ${fieldLabel}`
                            } : undefined
                        })}
                        id={field.name}
                        rows={3}
                        placeholder={fieldPlaceholder}
                        className={inputClasses}
                    />
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            );

        case 'select':
            return (
                <div className="space-y-2">
                    <div className="flex items-center">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                            {unitText}
                        </label>
                        {InheritanceBadge}
                    </div>
                    <select
                        {...register(fieldName, {
                            required: field.required ? `${fieldLabel} is required` : false
                        })}
                        id={field.name}
                        className={inputClasses}
                    >
                        <option value="">Select {fieldLabel}</option>
                        {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            );

        case 'number':
            return (
                <div className="space-y-2">
                    <div className="flex items-center">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                            {unitText}
                        </label>
                        {InheritanceBadge}
                    </div>
                    <input
                        {...register(fieldName, {
                            required: field.required ? `${fieldLabel} is required` : false,
                            min: field.validation?.min ? {
                                value: parseFloat(field.validation.min),
                                message: `Minimum value is ${field.validation.min}${field.unit ? ` ${field.unit}` : ''}`
                            } : undefined,
                            max: field.validation?.max ? {
                                value: parseFloat(field.validation.max),
                                message: `Maximum value is ${field.validation.max}${field.unit ? ` ${field.unit}` : ''}`
                            } : undefined
                        })}
                        id={field.name}
                        type="number"
                        step="any"
                        placeholder={fieldPlaceholder}
                        className={inputClasses}
                    />
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            );

        case 'date':
            return (
                <div className="space-y-2">
                    <div className="flex items-center">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {InheritanceBadge}
                    </div>
                    <input
                        {...register(fieldName, {
                            required: field.required ? `${fieldLabel} is required` : false
                        })}
                        id={field.name}
                        type="date"
                        className={inputClasses}
                    />
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            );

        case 'boolean':
            return (
                <div className="space-y-2">
                    <div className="flex items-center">
                        <input
                            {...register(fieldName)}
                            id={field.name}
                            type="checkbox"
                            className="h-4 w-4 text-black rounded focus:ring-black border-gray-300"
                        />
                        <label htmlFor={field.name} className="ml-2 block text-sm text-gray-700">
                            {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {InheritanceBadge}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            );

        default:
            return (
                <div className="space-y-2">
                    <div className="flex items-center">
                        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                            {fieldLabel} {field.required && <span className="text-red-500">*</span>}
                            {unitText}
                        </label>
                        {InheritanceBadge}
                    </div>
                    <input
                        {...register(fieldName, {
                            required: field.required ? `${fieldLabel} is required` : false,
                            minLength: field.validation?.minLength ? {
                                value: field.validation.minLength,
                                message: `Minimum ${field.validation.minLength} characters`
                            } : undefined,
                            maxLength: field.validation?.maxLength ? {
                                value: field.validation.maxLength,
                                message: `Maximum ${field.validation.maxLength} characters`
                            } : undefined,
                            pattern: field.validation?.pattern ? {
                                value: new RegExp(field.validation.pattern),
                                message: field.validation.message || `Invalid format for ${fieldLabel}`
                            } : undefined
                        })}
                        id={field.name}
                        type={field.fieldType === 'text' ? 'text' : field.fieldType}
                        placeholder={fieldPlaceholder}
                        className={inputClasses}
                    />
                    {error && <p className="text-red-500 text-sm">{error.message}</p>}
                </div>
            );
    }
};

const EditAuction = () => {
    const [step, setStep] = useState(1);
    const [allPhotos, setAllPhotos] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [removedPhotos, setRemovedPhotos] = useState([]);
    const [removedDocuments, setRemovedDocuments] = useState([]);

    // Bundle items state
    const [bundleItems, setBundleItems] = useState([]);
    const [showItemModal, setShowItemModal] = useState(false);
    const [editingItemIndex, setEditingItemIndex] = useState(null);

    const isInitialLoad = useRef(true);

    // Category state
    const [parentCategories, setParentCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);
    const [categoryFields, setCategoryFields] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingFields, setLoadingFields] = useState(false);

    // Calculate if there are new files to upload
    const newPhotos = allPhotos.filter(photo => !photo.isExisting);
    const hasNewUploads = newPhotos.length > 0 || uploadedDocuments.length > 0;
    const totalNewFiles = newPhotos.length + uploadedDocuments.length;

    // caption states
    const [photoCaptions, setPhotoCaptions] = useState([]);
    const [documentCaptions, setDocumentCaptions] = useState([]);
    const [uploadedDocumentCaptions, setUploadedDocumentCaptions] = useState([]);

    const { auctionId } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        trigger,
        getValues,
        control,
        reset,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            auctionType: 'buy_now',
            endDate: '',
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
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch subcategories
    const fetchSubCategories = async (parentSlug) => {
        try {
            setLoadingCategories(true);
            const { data } = await axiosInstance.get(`/api/v1/categories/public/${parentSlug}/children`);
            if (data.success) {
                setSubCategories(data.data.subcategories);
                setSelectedParent(data.data.parent);
                return data.data.subcategories; // ← return it
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch category fields
    const fetchCategoryFields = async (slug) => {
        try {
            setLoadingFields(true);
            const { data } = await axiosInstance.get(`/api/v1/categories/public/by-slug/${slug}/fields`);
            if (data.success) {
                setCategoryFields(data.data.fields || []);
            }
        } catch (error) {
            console.error('Error fetching category fields:', error);
            setCategoryFields([]);
        } finally {
            setLoadingFields(false);
        }
    };

    // Fetch parent categories on mount
    useEffect(() => {
        fetchParentCategories();
    }, []);

    // Guard the reset effect so it doesn't fire on initial load
    useEffect(() => {
        if (isInitialLoad.current) return; // ← skip on first render

        if (selectedParentSlug) {
            fetchSubCategories(selectedParentSlug);
            setValue('category', '');
            setCategoryFields([]);
            setBundleItems([]);
        }
    }, [selectedParentSlug]);

    // Fetch fields when subcategory is selected
    useEffect(() => {
        if (selectedCategory) {
            fetchCategoryFields(selectedCategory);
        } else {
            setCategoryFields([]);
        }
    }, [selectedCategory]);

    const movePhoto = useCallback((dragIndex, hoverIndex) => {
        setAllPhotos(prevPhotos => {
            const updatedPhotos = [...prevPhotos];
            const [movedPhoto] = updatedPhotos.splice(dragIndex, 1);
            updatedPhotos.splice(hoverIndex, 0, movedPhoto);
            return updatedPhotos;
        });

        setPhotoCaptions(prevCaptions => {
            const updatedCaptions = [...prevCaptions];
            const [movedCaption] = updatedCaptions.splice(dragIndex, 1);
            updatedCaptions.splice(hoverIndex, 0, movedCaption);
            return updatedCaptions;
        });
    }, []);

    // Bundle item handlers
    const addBundleItem = (itemData) => {
        const newItem = {
            id: Date.now(), // temporary ID
            quantity: itemData.quantity || 1,
            specifications: itemData.specifications,
            notes: itemData.notes || ''
        };
        setBundleItems([...bundleItems, newItem]);
        setShowItemModal(false);
        setEditingItemIndex(null);
    };

    const updateBundleItem = (index, itemData) => {
        const updated = [...bundleItems];
        updated[index] = {
            ...updated[index],
            quantity: itemData.quantity || 1,
            specifications: itemData.specifications,
            notes: itemData.notes || ''
        };
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

    const handleEditItem = (index, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setEditingItemIndex(index);
        setShowItemModal(true);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16);
    };

    const mapToObject = (map) => {
        if (!map) return {};
        if (map instanceof Map) {
            const obj = {};
            map.forEach((value, key) => { obj[key] = value; });
            return obj;
        }
        // Handle plain objects (already converted by JSON serialization)
        if (typeof map === 'object') return map;
        return {};
    };

    // Fetch auction data
    useEffect(() => {
        const fetchAuctionData = async () => {
            try {
                setIsLoading(true);
                const { data } = await axiosInstance.get(`/api/v1/admin/auctions/${auctionId}`);

                if (data.success) {
                    const auction = data.data.auction;

                    // Handle categories
                    const categories = auction.categories || [];
                    let parentSlug = null;
                    let subCategorySlug = null;

                    if (categories.length >= 2) {
                        parentSlug = categories[0];
                        subCategorySlug = categories[1];
                    } else if (categories.length === 1) {
                        subCategorySlug = categories[0];
                    }

                    // Set the form values
                    setValue('parentCategory', parentSlug || '');
                    setValue('category', subCategorySlug || '');

                    // Set basic fields
                    const formData = {
                        title: auction.title,
                        parentCategory: parentSlug || '',
                        category: subCategorySlug || '',
                        features: auction.features || '',
                        description: auction.description,
                        location: auction.location,
                        video: auction.videoLink,
                        startDate: formatDateForInput(auction.startDate),
                        endDate: formatDateForInput(auction.endDate),
                        startPrice: auction.startPrice,
                        bidIncrement: auction.bidIncrement,
                        auctionType: auction.auctionType,
                        reservePrice: auction.reservePrice,
                        buyNowPrice: auction.buyNowPrice,
                        allowOffers: auction.allowOffers,
                        parcel: {
                            weight: auction.parcel?.weight || '',
                            length: auction.parcel?.length || '',
                            width: auction.parcel?.width || '',
                            height: auction.parcel?.height || '',
                            distanceUnit: auction.parcel?.distanceUnit || 'in',
                            massUnit: auction.parcel?.massUnit || 'lb'
                        }
                    };

                    reset(formData);

                    // If parent category exists, fetch its subcategories
                    if (parentSlug) {
                        await fetchSubCategories(parentSlug);
                    }

                    // If subcategory exists, fetch its fields
                    if (subCategorySlug) {
                        await fetchCategoryFields(subCategorySlug);
                    }

                    isInitialLoad.current = false;

                    // Load bundle items if they exist
                    if (auction.bundleItems && auction.bundleItems.length > 0) {
                        const loadedBundleItems = auction.bundleItems.map((item, index) => {

                            return {
                                id: item._id || `item-${index}`,
                                quantity: item.quantity || 1,
                                specifications: item.specifications || {},
                                notes: item.notes || ''
                            };
                        });
                        setBundleItems(loadedBundleItems);
                    }

                    // Initialize photos, documents, service records...
                    const existingPhotosWithFlag = (auction.photos || []).map(photo => ({
                        ...photo,
                        isExisting: true,
                        id: photo.publicId || photo._id,
                        url: photo.url
                    }));
                    setAllPhotos(existingPhotosWithFlag);

                    setExistingDocuments(auction.documents || []);

                    toast.success('Auction data loaded successfully');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load auction data');
                navigate('/admin/auctions/all');
            } finally {
                setIsLoading(false);
            }
        };

        if (auctionId) fetchAuctionData();
    }, [auctionId, reset, setValue, navigate]);

    const nextStep = async () => {
        let isValid = true;

        scrollTo({ top: 0, behavior: 'smooth' });

        if (step === 1) {
            const fieldsToValidate = ['title', 'category', 'description', 'startDate', 'endDate'];

            const overallValidationPassed = await trigger(fieldsToValidate);

            if (!overallValidationPassed) {
                isValid = false;
            }

            if (allPhotos.length === 0) {
                setError('photos', {
                    type: 'manual',
                    message: 'At least one photo is required'
                });
                isValid = false;
            } else {
                clearErrors('photos');
            }

            // Validate at least one bundle item
            if (bundleItems.length === 0) {
                toast.error('Please add at least one item to the bundle');
                isValid = false;
            }
        }

        if (step === 2) {
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

            const overallValidationPassed = await trigger(fieldsToValidate);

            if (!overallValidationPassed) {
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }

        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
        scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        const newPhotos = files.map(file => {
            const fileId = `${file.name}-${file.size}-${file.lastModified}`;
            const uniqueId = `new-${Date.now()}-${fileId.replace(/[^a-zA-Z0-9]/g, '-')}`;

            return {
                file,
                isExisting: false,
                id: uniqueId,
                _fileSignature: `${file.name}-${file.size}-${file.lastModified}`
            };
        });

        const existingSignatures = new Set(
            allPhotos
                .filter(photo => !photo.isExisting)
                .map(photo => photo._fileSignature)
        );

        const uniqueNewPhotos = newPhotos.filter(photo =>
            !existingSignatures.has(photo._fileSignature)
        );

        if (uniqueNewPhotos.length === 0) {
            toast.error('Some photos are already added');
            return;
        }

        setAllPhotos(prev => {
            const existingSignatures = new Set(
                prev.filter(p => !p.isExisting).map(p => p._fileSignature)
            );

            const filteredNewPhotos = uniqueNewPhotos.filter(photo =>
                !existingSignatures.has(photo._fileSignature)
            );

            return [...filteredNewPhotos, ...prev];
        });

        const newCaptions = [...photoCaptions];
        files.forEach(() => newCaptions.unshift(''));
        setPhotoCaptions(newCaptions);

        clearErrors('photos');
        e.target.value = '';
    };

    const removePhoto = (index) => {
        const photoToRemove = allPhotos[index];

        if (photoToRemove.isExisting) {
            setRemovedPhotos(prev => [...prev, photoToRemove.id]);
        }

        setAllPhotos(prev => prev.filter((_, i) => i !== index));

        const newCaptions = [...photoCaptions];
        newCaptions.splice(index, 1);
        setPhotoCaptions(newCaptions);

        if (allPhotos.length === 1) {
            setError('photos', {
                type: 'manual',
                message: 'At least one photo is required'
            });
        }
    };

    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        setUploadedDocuments([...uploadedDocuments, ...files]);

        const newCaptions = [...uploadedDocumentCaptions];
        files.forEach(() => newCaptions.push(''));
        setUploadedDocumentCaptions(newCaptions);
    };

    const removeDocument = (index, isExisting = false) => {
        if (isExisting) {
            const removedDoc = existingDocuments[index];
            setRemovedDocuments(prev => [...prev, removedDoc.publicId || removedDoc._id]);
            setExistingDocuments(existingDocuments.filter((_, i) => i !== index));

            const newCaptions = [...documentCaptions];
            newCaptions.splice(index, 1);
            setDocumentCaptions(newCaptions);
        } else {
            setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));

            const newCaptions = [...uploadedDocumentCaptions];
            newCaptions.splice(index, 1);
            setUploadedDocumentCaptions(newCaptions);
        }
    };

    const handlePhotoCaptionChange = (index, value) => {
        const newCaptions = [...photoCaptions];
        newCaptions[index] = value;
        setPhotoCaptions(newCaptions);
    };

    const handleDocumentCaptionChange = (type, index, value) => {
        if (type === 'existing') {
            const newCaptions = [...documentCaptions];
            newCaptions[index] = value;
            setDocumentCaptions(newCaptions);
        } else {
            const newCaptions = [...uploadedDocumentCaptions];
            newCaptions[index] = value;
            setUploadedDocumentCaptions(newCaptions);
        }
    };

    // Update auction handler
    const updateAuctionHandler = async (formData) => {
        try {
            setIsSubmitting(true);

            const formDataToSend = new FormData();

            // Append all text fields
            formDataToSend.append('title', formData.title);

            // Categories handling
            const categoriesToStore = [];
            if (formData.parentCategory) {
                categoriesToStore.push(formData.parentCategory);
            }
            if (formData.category) {
                categoriesToStore.push(formData.category);
            }
            formDataToSend.append('categories', JSON.stringify(categoriesToStore));

            formDataToSend.append('features', formData.features || '');
            formDataToSend.append('description', formData.description);
            formDataToSend.append('location', formData.location || '');
            formDataToSend.append('videoLink', formData.video || '');
            formDataToSend.append('auctionType', formData.auctionType);
            formDataToSend.append('allowOffers', formData.allowOffers || false);
            formDataToSend.append('startDate', new Date(formData.startDate).toISOString());
            formDataToSend.append('endDate', new Date(formData.endDate).toISOString());

            // Bundle Items
            if (bundleItems.length > 0) {
                formDataToSend.append('bundleItems', JSON.stringify(bundleItems.map(item => ({
                    quantity: item.quantity,
                    specifications: item.specifications,
                    notes: item.notes || ''
                }))));
            }

            // Add parcel data if provided
            if (formData.parcel) {
                formDataToSend.append('parcel', JSON.stringify({
                    weight: formData.parcel.weight || '',
                    length: formData.parcel.length || '',
                    width: formData.parcel.width || '',
                    height: formData.parcel.height || '',
                    distanceUnit: formData.parcel.distanceUnit || 'in',
                    massUnit: formData.parcel.massUnit || 'lb'
                }));
            }

            // ===== PRICING HANDLING =====
            if (formData.auctionType === 'giveaway' || formData.auctionType === 'buy_now') {
                formDataToSend.append('startPrice', 0);

                if (formData.reservePrice) {
                    formDataToSend.append('reservePrice', null);
                }

                if (formData.auctionType === 'buy_now' && formData.buyNowPrice) {
                    formDataToSend.append('buyNowPrice', formData.buyNowPrice);
                }

                if (formData.auctionType === 'buy_now' && formData.bidIncrement) {
                    formDataToSend.append('bidIncrement', formData.bidIncrement);
                }
            } else {
                if (formData.startPrice) {
                    formDataToSend.append('startPrice', formData.startPrice);
                }

                if (formData.auctionType === 'standard' || formData.auctionType === 'reserve') {
                    if (formData.bidIncrement) {
                        formDataToSend.append('bidIncrement', formData.bidIncrement);
                    }
                    if (formData.buyNowPrice) {
                        formDataToSend.append('buyNowPrice', null);
                    }
                }

                if (formData.auctionType === 'reserve' && formData.reservePrice) {
                    formDataToSend.append('reservePrice', formData.reservePrice);
                }
            }

            // Add removed items
            if (removedPhotos.length > 0) {
                formDataToSend.append('removedPhotos', JSON.stringify(removedPhotos));
            }

            if (removedDocuments.length > 0) {
                formDataToSend.append('removedDocuments', JSON.stringify(removedDocuments));
            }

            // Send photo order
            const photoOrder = allPhotos.map(photo => ({
                id: photo.id,
                isExisting: photo.isExisting
            }));
            formDataToSend.append('photoOrder', JSON.stringify(photoOrder));

            // Photos
            allPhotos.forEach((photo, index) => {
                formDataToSend.append('photoCaptions', photoCaptions[index] || '');

                if (!photo.isExisting && photo.file) {
                    formDataToSend.append('photos', photo.file);
                }
            });

            // Documents
            documentCaptions.forEach((caption, index) => {
                formDataToSend.append('existingDocumentCaptions', caption || '');
            });

            uploadedDocuments.forEach((doc, index) => {
                formDataToSend.append('documents', doc);
                formDataToSend.append('newDocumentCaptions', uploadedDocumentCaptions[index] || '');
            });

            const { data } = await axiosInstance.put(
                `/api/v1/admin/auctions/${auctionId}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (data.success) {
                toast.success('Auction updated successfully!');
                navigate('/admin/auctions/all');
            } else {
                throw new Error(data.message || 'Failed to update auction');
            }
        } catch (error) {
            console.error('Error updating auction:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to update auction';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            allPhotos.forEach(photo => {
                if (!photo.isExisting && photo.url && photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });
        };
    }, []);

    if (isLoading) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="w-full relative">
                    <AdminHeader />
                    <AdminContainer>
                        <div className="pt-16 md:py-7 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    </AdminContainer>
                </div>
            </section>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <section className="flex min-h-screen bg-gray-50">
                <AdminSidebar />

                <UploadProgressModal
                    isOpen={isSubmitting && hasNewUploads}
                    fileCount={totalNewFiles}
                    isEdit={true}
                />

                <div className="w-full relative">
                    <AdminHeader />

                    <AdminContainer>
                        <div className="pt-16 md:py-7">
                            <div className="flex items-center gap-3 mb-5">
                                <button
                                    onClick={() => navigate('/admin/auctions/all')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <h1 className="text-3xl md:text-4xl font-bold">Edit Auction</h1>
                            </div>

                            {/* Progress Steps */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    {['Auction Info', 'Pricing & Bidding', 'Review & Submit'].map((label, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step > index + 1 ? 'bg-green-500 text-white' :
                                                step === index + 1 ? 'bg-[#1e2d3b] text-white' : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {step > index + 1 ? <CheckCircle size={20} /> : index + 1}
                                            </div>
                                            <span className="text-sm mt-2 hidden md:block">{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-full bg-gray-200 h-3 rounded-full">
                                    <div
                                        className="bg-[#1e2d3b] h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${(step / 3) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(updateAuctionHandler)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                {/* Step 1: Auction Information */}
                                {step === 1 && (
                                    <div>
                                        <h2 className="text-xl font-semibold mb-6 flex items-center">
                                            <Package size={20} className="mr-2" />
                                            Bundle Information
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">Bundle Name *</label>
                                                <input
                                                    {...register('title', { required: 'Bundle name is required' })}
                                                    id="title"
                                                    type="text"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    placeholder="e.g., Summer T-shirt Bundle (10 pcs)"
                                                />
                                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                        disabled={!watch('parentCategory') || loadingCategories}
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

                                        {/* Bundle Items Section */}
                                        {watch('category') && categoryFields.length > 0 && (
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
                                                                        key={item.id || index}
                                                                        item={item}
                                                                        index={index}
                                                                        categoryFields={categoryFields}
                                                                        moveItem={moveBundleItem}
                                                                        onEdit={() => handleEditItem(index)}
                                                                        onRemove={() => removeBundleItem(index)}
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

                                        {/* Bundle Item Modal */}
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

                                        {/* Parcel Details Section */}
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
                                            <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">Bundle Description *</label>
                                            <RTE
                                                name="description"
                                                control={control}
                                                label="Description:"
                                                defaultValue={getValues('description') || ''}
                                                onBlur={(value) => {
                                                    setValue('description', value, { shouldValidate: true });
                                                }}
                                            />
                                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-secondary mb-1">Location</label>
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
                                                <label htmlFor="video" className="block text-sm font-medium text-secondary mb-1">Video Link</label>
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
                                                        placeholder="YouTube video URL"
                                                    />
                                                </div>
                                                {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video.message}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label htmlFor="startDate" className="block text-sm font-medium text-secondary mb-1">Start Date & Time *</label>
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
                                                <label htmlFor="endDate" className="block text-sm font-medium text-secondary mb-1">End Date & Time *</label>
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
                                            <label htmlFor="photo-upload" className="block text-sm font-medium text-secondary mb-1">Attach Photos *</label>
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

                                            {allPhotos.length > 0 && (
                                                <PhotoGallery
                                                    photos={allPhotos}
                                                    movePhoto={movePhoto}
                                                    removePhoto={removePhoto}
                                                    captions={photoCaptions}
                                                    onCaptionChange={handlePhotoCaptionChange}
                                                />
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="document-upload" className="block text-sm font-medium text-secondary mb-1">Attach Documents</label>
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

                                            {existingDocuments.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-secondary mb-2">Existing Documents:</p>
                                                    <div className="space-y-2">
                                                        {existingDocuments.map((doc, index) => (
                                                            <div key={`existing-doc-${index}`} className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium truncate">{doc.filename || doc.originalName}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeDocument(index, true)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {uploadedDocuments.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-secondary mb-2">New Documents:</p>
                                                    <div className="space-y-2">
                                                        {uploadedDocuments.map((doc, index) => (
                                                            <div key={`new-doc-${index}`} className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-medium truncate">{doc.name}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeDocument(index, false)}
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Add document caption..."
                                                                    value={uploadedDocumentCaptions[index] || ''}
                                                                    onChange={(e) => handleDocumentCaptionChange('new', index, e.target.value)}
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
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
                                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
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
                                                        </div>)}                                                    {(watch('auctionType') === 'standard' || watch('auctionType') === 'reserve') && (
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

                                                {/* Allow Offers Toggle */}
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

                                        {/* Show giveaway info */}
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
                                                                    {watch('auctionType') === 'standard' && 'Standard Auction'}
                                                                    {watch('auctionType') === 'reserve' && 'Reserve Price Auction'}
                                                                    {watch('auctionType') === 'buy_now' && 'Buy Now Auction'}
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
                                                        <h4 className="font-medium mb-3">Media & Documents</h4>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-xs text-secondary">Total Photos</p>
                                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                    {allPhotos.length} photos
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-xs text-secondary">Existing Photos</p>
                                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                    {allPhotos.filter(photo => photo.isExisting).length} photos
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-xs text-secondary">New Photos</p>
                                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                    {allPhotos.filter(photo => !photo.isExisting).length} uploaded
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-xs text-secondary">Documents</p>
                                                                <span className="font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                                                    {existingDocuments.length + uploadedDocuments.length} total
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

                                                    {/* Parcel Details Preview - Add after Pricing section */}
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
                                            disabled={isSubmitting}
                                            className="flex items-center px-6 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Gavel size={18} className="mr-2" />
                                            {isSubmitting ? 'Updating Auction...' : 'Update Auction'}
                                        </button>
                                    )}
                                </div>
                                {errors.endDate && <p className='text-sm text-orange-500 float-right'>Please set end date to proceed.</p>}
                            </form>
                        </div>
                    </AdminContainer>
                </div>
            </section>
        </DndProvider>
    );
};

export default EditAuction;