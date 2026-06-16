import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Lazy loading components for optimal chunking and responsive speed
const HomePage = lazy(() => import("../pages/home/HomePage"));
const ShopPage = lazy(() => import("../pages/shop/ShopPage"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetailPage"));
const BlogListPage = lazy(() => import("../pages/blog/BlogListPage"));
const BlogDetailPage = lazy(() => import("../pages/blog/BlogDetailPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const CheckoutPage = lazy(() => import("../pages/checkout/CheckoutPage"));
const OrderHistoryPage = lazy(() => import("../pages/account/OrderHistoryPage"));
const NotFound = lazy(() => import("../pages/notfound/NotFound"));

// Clean loading placeholder with Atelier display branding
const PageLoaderPlaceholder = () => (
  <div className="min-h-[50vh] w-full flex flex-col items-center justify-center py-20">
    <div className="flex flex-col items-center gap-3">
      {/* Pulse visual loader */}
      <div className="h-6 w-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-mono tracking-[0.2em] font-bold text-neutral-400 uppercase animate-pulse">
        Atelier Loading...
      </span>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoaderPlaceholder />}>
      <Routes>
        {/* PUBLIC STREET routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/shop" element={<MainLayout><ShopPage /></MainLayout>} />
        <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><BlogListPage /></MainLayout>} />
        <Route path="/blog/:id" element={<MainLayout><BlogDetailPage /></MainLayout>} />
        
        {/* GUESTS / AUTH SESSIONS routes */}
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        
        {/* SHOP CARTS routes */}
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
        
        {/* CUSTOMER PROFILE ROUTES */}
        <Route path="/account/orders" element={<MainLayout><OrderHistoryPage /></MainLayout>} />

        {/* CATCH-ALL Redirect */}
        <Route path="*" element={<MainLayout><NotFound/></MainLayout>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
