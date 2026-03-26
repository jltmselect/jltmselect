import { Outlet } from "react-router-dom";
import { Footer, Header, MobileNav, ScrollToTop, ScrollToTopIcon, SearchFormPopUp } from "./components";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import { usePopUp } from "./contexts/PopUpContextProvider";

const CategoryImagesSection = lazy(() => import('./components/CategoryImagesSection'));

function App() {
    const { isPopupOpen, closePopup } = usePopUp();
    const isSearchFormPopUpOpen = isPopupOpen('searchForm');
    const isCategoryImagesSectionOpen = isPopupOpen('category');
    const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "bn", name: "Bangla", flag: "🇧🇩" }
];
    useEffect(() => {
        const removeGoogleBar = () => {
            // Only hide the iframe banner, don't touch skiptranslate
            document.querySelectorAll(".goog-te-banner-frame").forEach(el => {
                el.style.display = "none";
            });

            // Fix body position shift
            document.body.style.top = "0px";
            document.documentElement.style.removeProperty("top");
        };

        removeGoogleBar();
        const interval = setInterval(removeGoogleBar, 500);

        const observer = new MutationObserver(removeGoogleBar);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
    // Function to initialize language from cookie
    const initializeLanguage = () => {
        // Check if we're coming from a language switch
        const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
        if (match) {
            const code = match[1];
            // Find and set the current language
            const lang = languages.find(l => l.code === code) || languages[0];
            // You'll need to expose this setter or use a context
        }
    };

    // Ensure Google Translate doesn't hide content
    const style = document.createElement('style');
    style.textContent = `
        .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; }
        .skiptranslate { display: none !important; }
        .goog-te-gadget-simple { font-size: 0px !important; }
    `;
    document.head.appendChild(style);

    // Wait for Google Translate to load
    const checkGoogleTranslate = setInterval(() => {
        if (window.google && window.google.translate) {
            clearInterval(checkGoogleTranslate);
            initializeLanguage();
        }
    }, 100);

    return () => clearInterval(checkGoogleTranslate);
}, []);
    return (
        <main className="bg-gray-50">
            <Header />
            <Outlet />
            <Footer />
            <MobileNav />
            <Toaster />
            <ScrollToTop />
            <ScrollToTopIcon />
            {isSearchFormPopUpOpen && <SearchFormPopUp closePopup={closePopup} />}
            {isCategoryImagesSectionOpen && <Suspense><CategoryImagesSection closePopup={closePopup} /></Suspense>}
        </main>
    );
}

export default App;