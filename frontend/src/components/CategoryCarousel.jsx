import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Tractor, Building2, Trees, Truck, Wrench, Package, Leaf, Warehouse, Cog } from "lucide-react";
import "keen-slider/keen-slider.min.css";

// Map category names to icons (fallback)
const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('agriculture') || name.includes('tractor')) return Tractor;
    if (name.includes('construction') || name.includes('building')) return Building2;
    if (name.includes('forestry') || name.includes('tree')) return Trees;
    if (name.includes('transport') || name.includes('truck')) return Truck;
    if (name.includes('ground') || name.includes('lawn')) return Wrench;
    if (name.includes('material') || name.includes('handling')) return Package;
    if (name.includes('spray') || name.includes('irrigation')) return Leaf;
    if (name.includes('spare') || name.includes('parts')) return Cog;
    if (name.includes('storage') || name.includes('silo')) return Warehouse;
    return Package; // default icon
};

function CategoryCarousel({ categories = [], onCategoryClick }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
        slides: { perView: 1, spacing: 16 },
        breakpoints: {
            "(min-width: 640px)": { slides: { perView: 1, spacing: 16 } },
            "(min-width: 768px)": { slides: { perView: 2, spacing: 16 } },
            "(min-width: 1024px)": { slides: { perView: 3, spacing: 20 } },
            "(min-width: 1280px)": { slides: { perView: 4, spacing: 20 } },
        },
        loop: categories.length > 5,
    });

    // autoplay
    useEffect(() => {
        if (!instanceRef.current || categories.length <= 5) return;
        const interval = setInterval(() => instanceRef.current?.next(), 4500);
        return () => clearInterval(interval);
    }, [instanceRef, categories.length]);

    // Don't render if no categories
    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-12 bg-bg-secondary dark:bg-bg-primary rounded-lg">
                <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-text-secondary dark:text-text-secondary-dark">
                    No categories available
                </h3>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* arrows - only show if more than 5 categories */}
            {loaded && instanceRef.current && categories.length > 5 && (
                <>
                    <button
                        onClick={() => instanceRef.current?.prev()}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-pure-white dark:bg-bg-primary shadow-md rounded-full p-2 hover:scale-105 transition z-10 text-text-primary dark:text-text-primary-dark"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => instanceRef.current?.next()}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-pure-white dark:bg-bg-primary shadow-md rounded-full p-2 hover:scale-105 transition z-10 text-text-primary dark:text-text-primary-dark"
                        aria-label="Next"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* slider */}
            <div ref={sliderRef} className="keen-slider">
                {categories.map((category) => {
                    const Icon = getCategoryIcon(category.name);
                    // Use the image from API if available, otherwise fallback to placeholder
                    const imageUrl = category.image || `https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&auto=format&fit=crop`;

                    return (
                        <div key={category.slug || category._id} className="keen-slider__slide">
                            <button
                                onClick={() => onCategoryClick(category.slug)}
                                className="w-full focus:outline-none"
                            >
                                <div className="relative border border-white/20 h-96 md:h-80 rounded-sm overflow-hidden group cursor-pointer">

                                    {/* Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                        style={{ backgroundImage: `url(${imageUrl})` }}
                                    />

                                    {/* subtle dark overlay */}
                                    <div className="absolute inset-0 bg-pure-black/20" />

                                    {/* Bottom gradient overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-bg-primary/80 dark:bg-bg-secondary/80 p-5 transition-all duration-300 text-start">

                                        <div className="flex flex-col items-start gap-2">

                                            {/* Icon */}
                                            <div className="">
                                                <Icon size={18} className="text-pure-white dark:text-pure-black" />
                                            </div>

                                            {/* Text */}
                                            <div>
                                                <h3 className="text-pure-white dark:text-pure-black font-medium text-lg leading-tight">
                                                    {category.name}
                                                </h3>

                                                <p className="text-pure-white/80 dark:text-pure-black/80 font-extralight text-xs mt-1">
                                                    {category.description}
                                                </p>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Dots Navigation */}
            {loaded && instanceRef.current && categories.length > 5 && (
                <div className="flex justify-center mt-6 gap-2">
                    {[
                        ...Array(instanceRef.current.track.details.slides.length).keys(),
                    ].map((idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                currentSlide === idx
                                    ? 'bg-orange-500 w-6'
                                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryCarousel;