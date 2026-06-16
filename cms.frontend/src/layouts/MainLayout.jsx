import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  ArrowUp,
  LogOut,
} from "lucide-react";
import { getCategoriesThunk } from "../store/slices/categorySlice";
import { logout } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Load Categories on mount
  useEffect(() => {
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  // Keep track of scroll for floating active header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    toast.info("Logged out successfully.");
    navigate("/");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.newsEmail?.value;
    if (emailInput) {
      toast.success("Thank you for subscribing to ATELIER journals!");
      e.target.reset();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-neutral-900 antialiased">
      {/* 1. ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2 & 3. MAIN HEADER & DIRECTORY */}
      <Header
        scrolled={scrolled}
        categories={categories}
        isAuthenticated={isAuthenticated}
        user={user}
        totalQuantity={totalQuantity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearchSubmit={handleSearchSubmit}
        handleLogoutClick={handleLogoutClick}
      />

      {/* 4. MAIN WORKSPACE CONTENT WITH SIDE RAIL PATTERN */}
      <div className="flex-grow grid grid-cols-12 gap-0 w-full">
        {/* Left Side Rail Text for architectural styling */}
        <aside className="hidden md:flex md:col-span-1 border-r border-neutral-100 items-center justify-center py-24 min-h-[50vh]">
          <span className="-rotate-90 whitespace-nowrap text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-bold font-mono">
            Atelier Curated Edition • SS26
          </span>
        </aside>

        {/* Real Content Screen */}
        <main className="col-span-12 md:col-span-11 min-h-[60vh]">
          {children}
        </main>
      </div>

      {/* 5. BRAND TEASER NEWSLETTER & FOOTER */}
      <Footer handleNewsletterSubmit={handleNewsletterSubmit} />
    </div>
  );
};

export default MainLayout;
