import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, ShoppingBag } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Main Container */}
      <div className="w-full max-w-2xl">
        {/* Error Code */}
        <div className="text-center mb-8">
          <div className="text-[120px] font-black font-display text-neutral-950 leading-none tracking-tighter mb-4">
            404
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-6">
            Page Not Found
          </p>
        </div>

        {/* Error Message */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-neutral-950 mb-4 tracking-tight">
            The Page You're Looking For Doesn't Exist
          </h1>
          <p className="text-neutral-600 font-sans text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            It seems we couldn't find what you were searching for. Don't worry,
            you can return to our store or explore our latest collections.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3 bg-neutral-950 text-white font-bold text-sm uppercase tracking-tight hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 group"
          >
            <Home size={16} />
            Back to Home
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3 border border-neutral-950 text-neutral-950 font-bold text-sm uppercase tracking-tight hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2 group"
          >
            <ShoppingBag size={16} />
            Browse Shop
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-16 pt-12 border-t border-neutral-150">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-6">
            Quick Links
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <Link
              to="/shop"
              className="text-sm text-neutral-600 hover:text-neutral-950 transition-colors font-medium"
            >
              All Products
            </Link>
            <Link
              to="/blog"
              className="text-sm text-neutral-600 hover:text-neutral-950 transition-colors font-medium"
            >
              Stories
            </Link>
            <a
              href="mailto:support@atelier.com"
              className="text-sm text-neutral-600 hover:text-neutral-950 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
