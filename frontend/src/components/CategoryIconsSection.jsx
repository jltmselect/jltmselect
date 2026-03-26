import { useState, useEffect, lazy, Suspense } from 'react';
import { Container, LoadingSpinner } from '../components';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const CategoryCarousel = lazy(() => import('../components/CategoryCarousel'));

const CategoryIconsSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCategoryClick = (categorySlug) => {
        navigate(`/auctions?category=${categorySlug}`);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('/api/v1/categories/public/parents/with-images');

                if (data.success) {
                    setCategories(data.data);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <Container className="mb-14">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-7">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center justify-center p-3 rounded-lg shadow-md dark:shadow-gray-800">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg w-24 h-24 animate-pulse"></div>
                            <div className="bg-gray-200 dark:bg-gray-700 h-5 w-20 rounded animate-pulse mt-2"></div>
                        </div>
                    ))}
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-14 dark:bg-bg-primary bg-bg-secondary">
            <div className='mb-8'>
                <h2 className="text-3xl md:text-4xl font-bold text-pure-black dark:text-pure-white">
                    Curated Fashion Categories
                </h2>
                <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-3">
                    Navigate men's, women's, and kids' fashion the way it was meant to be browsed—beautifully organized, effortlessly discovered.
                </p>
            </div>

            <Suspense fallback={<LoadingSpinner />}>
                <CategoryCarousel
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                />
            </Suspense>
        </Container>
    );
};

export default CategoryIconsSection;