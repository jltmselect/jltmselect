import { Outlet } from "react-router-dom";
import { EmailVerificationWarning, Footer, MobileNav, ScrollToTop, ScrollToTopIcon, SearchFormPopUp, SellerHeader } from "../../components";
import { Toaster } from "react-hot-toast";
import { usePopUp } from "../../contexts/PopUpContextProvider";
import { lazy, Suspense } from "react";
import { useAuth } from "../../contexts/AuthContext";

const CategoryImagesSection = lazy(() => import('../../components/CategoryImagesSection'));

function Layout(){
    const { isPopupOpen, closePopup } = usePopUp();
    const isSearchFormPopUpOpen = isPopupOpen('searchForm');
    const isCategoryImagesSectionOpen = isPopupOpen('category');
    const { user } = useAuth();
    return (
        <>
            <ScrollToTop />
            <ScrollToTopIcon />
            <Toaster />
            {/* <SellerHeader /> */}
            <MobileNav />
            {user && !user.isEmailVerified && <EmailVerificationWarning user={user} />}
            <Outlet />
            <Footer />
            {isSearchFormPopUpOpen && <SearchFormPopUp closePopup={closePopup} />}
            {isCategoryImagesSectionOpen && <Suspense><CategoryImagesSection closePopup={closePopup} /></Suspense>}
        </>
    );
}

export default Layout;