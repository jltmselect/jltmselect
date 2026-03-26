import { Outlet } from "react-router-dom";
import { Footer, ScrollToTop, ScrollToTopIcon, BidderHeader, MobileNav, SearchFormPopUp, EmailVerificationWarning } from "../../components";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";
import { usePopUp } from "../../contexts/PopUpContextProvider";
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
            {/* <BidderHeader /> */}
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