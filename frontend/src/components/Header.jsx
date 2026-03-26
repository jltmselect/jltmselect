import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { closeMenu, darkLogo, logo, menuIcon } from "../assets";
import Container from "./Container";
import { ChevronRight, LayoutDashboard, LogIn, Search, ChevronDown, X, Gavel, Clock, DollarSign, Gift, Store, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePopUp } from "../contexts/PopUpContextProvider";
import axiosInstance from "../utils/axiosInstance";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
    {
        name: 'Home',
        href: '/'
    },
    {
        name: 'About',
        href: '/about'
    },
    // {
    //     name: 'Contact',
    //     href: '/contact'
    // },
    // {
    //     name: 'FAQs',
    //     href: '/faqs'
    // },
];

const auctionTypes = [
    { name: "Standard Auction", slug: "standard", icon: Gavel },
    { name: "Reserve Auction", slug: "reserve", icon: Clock },
    { name: "Buy Now", slug: "buy_now", icon: DollarSign },
];

const registerTypes = [
    { name: "Seller Account", slug: "seller", icon: Store },
    { name: "Buyer Account", slug: "bidder", icon: User },
];

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isAuctionTypesOpen, setIsAuctionTypesOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const auctionTypesRef = useRef(null);
    const registerRef = useRef(null);

    const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
    const [mobileAuctionTypesOpen, setMobileAuctionTypesOpen] = useState(false);
    const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
    const [activeMobileCategory, setActiveMobileCategory] = useState(null);

    useEffect(() => {
        if (categories.length > 0 && !hoveredCategory) {
            setHoveredCategory(categories[0].slug);
        }
    }, [categories]);

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (auctionTypesRef.current && !auctionTypesRef.current.contains(event.target)) {
                setIsAuctionTypesOpen(false);
            }

            if (registerRef.current && !registerRef.current.contains(event.target)) {
                setIsRegisterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch categories when popup opens
    useEffect(() => {
        const fetchCategories = async () => {
            if (isCategoriesOpen || mobileCategoriesOpen) {
                try {
                    setLoading(true);
                    const { data } = await axiosInstance.get('/api/v1/categories/public/parents');
                    if (data.success) {
                        const categoriesWithChildren = await Promise.all(
                            data.data.map(async (parent) => {
                                try {
                                    const childrenRes = await axiosInstance.get(`/api/v1/categories/public/${parent.slug}/children`);
                                    return {
                                        ...parent,
                                        children: childrenRes.data.success ? childrenRes.data.data.subcategories : [],
                                        auctionCount: parent.auctionCount || Math.floor(Math.random() * 10000)
                                    };
                                } catch (error) {
                                    return {
                                        ...parent,
                                        children: [],
                                        auctionCount: parent.auctionCount || Math.floor(Math.random() * 10000)
                                    };
                                }
                            })
                        );
                        setCategories(categoriesWithChildren);
                    }
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    setCategories([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCategories();
    }, [isCategoriesOpen, mobileCategoriesOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        }

        setIsScrolled(pathname !== '/');

        pathname === '/' && window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    // Format number with commas
    const formatNumber = (num) => {
        if (!num) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Handle auction type selection
    const handleAuctionTypeSelect = (slug) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('auctionType', slug);
        navigate(`/auctions?${searchParams.toString()}`);
        setIsAuctionTypesOpen(false);
        setMobileAuctionTypesOpen(false);
    };

    // Handle auction type selection
    const handleRegisterTypeSelect = (slug) => {
        navigate(`/register`);
        setIsRegisterOpen(false);
        setMobileRegisterOpen(false);
    };

    return (
        <header className={`${isScrolled
            ? 'fixed bg-bg-secondary dark:bg-bg-primary bg-opacity-100 shadow-lg shadow-pure-black/4 dark:shadow-pure-white/4'
            : 'absolute bg-opacity-0'} w-full transition-all duration-150 z-50`}
        >
            <Container className={`flex items-center justify-between py-4`}>
                <Link to="/">
                    <img
                        src={logo}
                        alt="Hangerstock's Logo"
                        className={`h-8 md:h-10 z-10 ${!isScrolled && pathname === '/' ? 'brightness-150 dark:brightness-150' : 'brightness-125'}`}
                    />
                </Link>

                {/* Navlinks for larger screens */}
                <nav className="hidden lg:block">
                    <ul className="flex items-center gap-7">
                        {navLinks.map(link => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.href}
                                    className={({ isActive }) =>
                                        `${isActive && isScrolled ? 'text-text-primary/80 dark:text-text-primary-dark/80' :
                                            isActive && !isScrolled ? 'text-text-primary-dark/80' :
                                                isScrolled ? 'text-text-primary dark:text-text-primary-dark' :
                                                    'text-text-primary-dark'} hover:underline`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}

                        {/* Auction Types Dropdown */}
                        <li
                            ref={auctionTypesRef}
                            className={`${isScrolled
                                ? 'text-text-primary dark:text-text-primary-dark'
                                : 'text-text-primary-dark'} relative`}
                        >
                            <button
                                onClick={() => setIsAuctionTypesOpen(!isAuctionTypesOpen)}
                                className="auction-types-trigger flex gap-1 items-center cursor-pointer hover:underline"
                            >
                                <span>Auctions</span>
                                <ChevronDown size={16} className={`transition-transform ${isAuctionTypesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isAuctionTypesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-bg-secondary dark:bg-bg-primary rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                                    {auctionTypes.map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <button
                                                key={type.slug}
                                                onClick={() => handleAuctionTypeSelect(type.slug)}
                                                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors text-text-primary dark:text-text-primary-dark"
                                            >
                                                <Icon size={18} className="text-orange-500" />
                                                <span>{type.name}</span>
                                            </button>
                                        );
                                    })}
                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                        <Link
                                            to="/auctions"
                                            onClick={() => setIsAuctionTypesOpen(false)}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors text-orange-500 font-medium"
                                        >
                                            <ChevronRight size={18} />
                                            <span>View All Auctions</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </li>

                        {/* Categories Dropdown */}
                        <li className={`${isScrolled
                            ? 'text-text-primary dark:text-text-primary-dark'
                            : 'text-text-primary-dark'} relative`}
                        >
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="categories-trigger flex gap-1 items-center cursor-pointer hover:underline"
                            >
                                <span>Categories</span>
                                <ChevronDown size={16} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoriesOpen && (
                                <div className="fixed inset-0 z-40 flex justify-center items-start pt-24 px-4">
                                    <div
                                        className="absolute inset-0 bg-pure-black/40 dark:bg-pure-black/60 backdrop-blur-sm"
                                        onClick={() => setIsCategoriesOpen(false)}
                                    />

                                    <div className="relative w-full max-w-6xl bg-bg-secondary dark:bg-bg-primary shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex h-[75vh]">
                                            {/* LEFT SIDEBAR - Dark in light mode, Light in dark mode */}
                                            <div className="w-1/4 overflow-y-auto py-4 border-r border-gray-200 dark:border-gray-700 bg-bg-primary dark:bg-bg-secondary">
                                                {categories.map((cat) => (
                                                    <div
                                                        key={cat.slug}
                                                        onMouseEnter={() => setHoveredCategory(cat.slug)}
                                                        onClick={() => setHoveredCategory(cat.slug)}
                                                        className={`flex items-center justify-between px-5 py-4 mx-4 cursor-pointer rounded-lg transition
                                    ${hoveredCategory === cat.slug
                                                                ? "bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark"
                                                                : "text-text-primary-dark dark:text-text-primary hover:bg-gray-800 dark:hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        <span className="font-medium">{cat.name}</span>
                                                        <ChevronRight size={18} />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* RIGHT CONTENT - Light in light mode, Dark in dark mode */}
                                            <div className="w-3/4 bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark p-8 overflow-y-auto">
                                                {categories
                                                    .filter((cat) => cat.slug === hoveredCategory)
                                                    .map((activeCat) => (
                                                        <div key={activeCat.slug}>
                                                            <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
                                                                {activeCat.name}
                                                            </p>

                                                            <button
                                                                onClick={() => setIsCategoriesOpen(false)}
                                                                className="absolute top-5 right-5 text-text-primary dark:text-text-primary-dark hover:text-text-primary/80 dark:hover:text-text-primary-dark/80 transition"
                                                            >
                                                                <X size={24} />
                                                            </button>

                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-4 mt-8">
                                                                {activeCat.children?.map((sub) => (
                                                                    <Link
                                                                        key={sub.slug}
                                                                        to={`/auctions?category=${hoveredCategory}&subcategory=${sub.slug}`}
                                                                        onClick={() => setIsCategoriesOpen(false)}
                                                                        className="flex gap-1 text-text-primary dark:text-text-primary-dark text-lg font-medium hover:underline"
                                                                    >
                                                                        {sub.name}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>

                        {/* Registration Dropdown */}
                        <li
                            ref={registerRef}
                            className={`${isScrolled
                                ? 'text-text-primary dark:text-text-primary-dark'
                                : 'text-text-primary-dark'} relative`}
                        >
                            <button
                                onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                                className="auction-types-trigger flex gap-1 items-center cursor-pointer hover:underline"
                            >
                                <span>Register</span>
                                <ChevronDown size={16} className={`transition-transform ${isRegisterOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isRegisterOpen && (
                                <div className="absolute top-full -right-full mt-2 w-56 bg-bg-secondary dark:bg-bg-primary rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                                    {registerTypes.map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <button
                                                key={type.slug}
                                                onClick={() => handleRegisterTypeSelect(type.slug)}
                                                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors text-text-primary dark:text-text-primary-dark"
                                            >
                                                <Icon size={18} className="text-orange-500" />
                                                <span>{type.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </li>

                        <li>
                            <ThemeToggle />
                        </li>

                        <li>
                            <LanguageSwitcher />
                        </li>

                        <li>
                            {user ? (
                                <button
                                    className="flex items-center gap-2 inset-0 bg-bg-primary hover:bg-bg-primary-light dark:bg-bg-secondary dark:hover:bg-bg-secondary-dark transition-colors text-pure-white dark:text-pure-black px-5 py-2 rounded-md cursor-pointer"
                                    onClick={() => navigate(`/${user.userType}/dashboard`)}
                                >
                                    <LayoutDashboard size={20} /> Dashboard
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 inset-0 bg-bg-primary hover:bg-bg-primary-light dark:bg-bg-secondary dark:hover:bg-bg-secondary-dark transition-colors text-pure-white dark:text-pure-black px-5 py-2 rounded-md cursor-pointer"
                                    onClick={() => navigate('/login')}
                                >
                                    <LogIn size={20} /> Log In
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>

                {/* Navlinks for smaller screens */}
                <nav className={`lg:hidden bg-bg-secondary dark:bg-bg-primary absolute top-0 left-0 min-h-screen transition-all duration-200 overflow-hidden text-center flex items-center justify-center text-text-primary dark:text-text-primary-dark ${isMenuOpen ? 'w-full' : 'w-0'}`}>
                    <ul>
                        {navLinks.map(link => (
                            <li onClick={() => setIsMenuOpen(false)} key={link.name} className="relative mx-5 py-2">
                                <NavLink className={({ isActive }) => ``} to={link.href}>{link.name}</NavLink>
                            </li>
                        ))}

                        {/* Mobile Auction Types */}
                        <li className="relative mx-5 py-2 mb-2">
                            <button
                                onClick={() => {
                                    setMobileAuctionTypesOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-1"
                            >
                                Auctions
                                <ChevronRight size={16} />
                            </button>
                        </li>

                        <li className="relative mx-5 py-2 mb-2">
                            <button
                                onClick={() => {
                                    setMobileCategoriesOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-1"
                            >
                                Categories
                                <ChevronRight size={16} />
                            </button>
                        </li>

                        {/* Mobile Register Types */}
                        <li className="relative mx-5 py-2 mb-2">
                            <button
                                onClick={() => {
                                    setMobileRegisterOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-1"
                            >
                                Register
                                <ChevronRight size={16} />
                            </button>
                        </li>

                        <li>
                            {user ? (
                                <button
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-pure-white px-5 py-2 rounded-md cursor-pointer"
                                    onClick={() => navigate(`/${user.userType}/dashboard`)}
                                >
                                    <LayoutDashboard size={20} /> Dashboard
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-pure-white px-5 py-2 rounded-md cursor-pointer"
                                    onClick={() => {
                                        navigate('/login');
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <LogIn size={20} /> Log In
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>

                {/* MOBILE AUCTION TYPES DRAWER */}
                <div
                    className={`fixed inset-0 bg-bg-secondary dark:bg-bg-primary z-[100] transform transition-transform duration-300 ${mobileAuctionTypesOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="h-full overflow-y-auto text-text-primary dark:text-text-primary-dark">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold">Auctions</h2>
                            <X
                                className="cursor-pointer"
                                onClick={() => setMobileAuctionTypesOpen(false)}
                            />
                        </div>

                        <div className="p-5 space-y-3">
                            {auctionTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={type.slug}
                                        onClick={() => {
                                            handleAuctionTypeSelect(type.slug);
                                            setMobileAuctionTypesOpen(false);
                                        }}
                                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
                                    >
                                        <div className="p-2 rounded-lg bg-bg-primary dark:bg-bg-secondary">
                                            <Icon size={20} className="text-text-primary-dark dark:text-text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{type.name}</h3>
                                            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{type.description}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="pt-4 mt-2">
                                <Link
                                    to="/auctions"
                                    onClick={() => setMobileAuctionTypesOpen(false)}
                                    className="flex items-center gap-2 text-text-primary dark:text-text-primary-dark font-medium"
                                >
                                    View all auctions <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE REGISTER TYPES DRAWER */}
                <div
                    className={`fixed inset-0 bg-bg-secondary dark:bg-bg-primary z-[100] transform transition-transform duration-300 ${mobileRegisterOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="h-full overflow-y-auto text-text-primary dark:text-text-primary-dark">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold">Register</h2>
                            <X
                                className="cursor-pointer"
                                onClick={() => setMobileRegisterOpen(false)}
                            />
                        </div>

                        <div className="p-5 space-y-3">
                            {registerTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={type.slug}
                                        onClick={() => {
                                            handleRegisterTypeSelect(type.slug);
                                            setMobileRegisterOpen(false);
                                        }}
                                        className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
                                    >
                                        <div className="p-2 rounded-lg bg-bg-primary dark:bg-bg-secondary">
                                            <Icon size={20} className="text-text-primary-dark dark:text-text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{type.name}</h3>
                                            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{type.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* MOBILE CATEGORIES DRAWER */}
                <div
                    className={`fixed inset-0 bg-bg-secondary dark:bg-bg-primary text-text-primary dark:text-text-primary-dark z-[100] transform transition-transform duration-300 ${mobileCategoriesOpen ? "translate-x-0" : "translate-x-full"}`}
                >
                    {/* LEVEL 1 — ALL CATEGORIES */}
                    {!activeMobileCategory && (
                        <div className="h-full overflow-y-auto">
                            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold">All Categories</h2>
                                <X
                                    className="cursor-pointer"
                                    onClick={() => setMobileCategoriesOpen(false)}
                                />
                            </div>

                            <div className="p-5 space-y-5">
                                {categories.map((cat) => (
                                    <div
                                        key={cat.slug}
                                        onClick={() => setActiveMobileCategory(cat)}
                                        className="flex justify-between items-center cursor-pointer text-lg font-medium"
                                    >
                                        <span>{cat.name}</span>
                                        <ChevronRight size={18} className="font-bold" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* LEVEL 2 — SINGLE CATEGORY */}
                    {activeMobileCategory && (
                        <div className="h-full overflow-y-auto">
                            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setActiveMobileCategory(null)}
                                    className="flex items-center gap-2"
                                >
                                    ← Back
                                </button>
                                <X
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setMobileCategoriesOpen(false);
                                        setActiveMobileCategory(null);
                                    }}
                                />
                            </div>

                            <div className="p-5">
                                <h2 className="text-[22px] font-bold text-text-primary dark:text-text-primary-dark">
                                    {activeMobileCategory.name}
                                </h2>

                                <div className="mt-6 space-y-2">
                                    {activeMobileCategory.children?.map((sub) => (
                                        <Link
                                            key={sub.slug}
                                            to={`/auctions?category=${activeMobileCategory.slug}&subcategory=${sub.slug}`}
                                            onClick={() => {
                                                setMobileCategoriesOpen(false);
                                                setActiveMobileCategory(null);
                                            }}
                                            className="flex justify-start gap-1 items-center text-lg font-medium text-text-primary dark:text-text-primary-dark hover:underline"
                                        >
                                            <span>{sub.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:hidden z-50 flex items-center gap-5">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    {isMenuOpen ? (
                        <img
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            src={closeMenu}
                            alt="menu icon"
                            className={`h-7 cursor-pointer invert-0 dark:invert z-50`}
                        />
                    ) : (
                        <img
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            src={menuIcon}
                            alt="menu icon"
                            className={`h-5 cursor-pointer ${!isScrolled && pathname === '/' ? 'invert-0 dark:invert-0' : 'invert dark:invert-0'} z-50`}
                        />
                    )}
                </div>
            </Container>
        </header>
    );
}

export default Header;