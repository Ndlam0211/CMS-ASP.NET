import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, X, Check, ArrowRight } from "lucide-react";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import ProductBadge from "./ProductBadge";
import {IMAGE_BASE_URL}  from "../../api/axiosClient";
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Rating, 
  Button 
} from "@mui/material";

export const ProductCard = ({ product, categories = [] }) => {
  const dispatch = useDispatch();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find Category Name
  const category = categories.find((c) => c.id === product.categoryProductId);
  const categoryName = category ? category.name : "Apparel";

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigation if wrapped
    if (product.stockQuantity === 0) {
      toast.error("This item is currently out of stock");
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added ${product.name} to cart!`, {
      position: "bottom-right",
      autoClose: 2000
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success(`Saved ${product.name} to wishlist!`, {
        position: "bottom-right",
        autoClose: 1500
      });
    } else {
      toast.info(`Removed ${product.name} from wishlist.`, {
        position: "bottom-right",
        autoClose: 1500
      });
    }
  };

  const handleQuickViewOpen = (e) => {
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const handleQuickViewClose = () => {
    setQuickViewOpen(false);
  };

  const handleQuickViewAddToCart = () => {
    if (product.stockQuantity === 0) {
      toast.error("This item is currently out of stock");
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added ${product.name} to cart!`, {
      position: "bottom-right"
    });
    setQuickViewOpen(false);
  };

  const ratingMockValue = (product.id % 3) + 3 + 0.5 * (product.id % 2); // Dynamic mock values 3.5, 4, 4.5

  return (
    <div className="group flex flex-col h-full bg-white border border-neutral-100 overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* 4:5 Aspect Ratio Image container */}
      <div className="relative w-full aspect-4/5 overflow-hidden bg-neutral-50">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={IMAGE_BASE_URL + product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Float tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          <ProductBadge stockQuantity={product.stockQuantity} categoryProductId={product.categoryProductId} />
        </div>

        {/* Hover quick actions box */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={handleWishlistToggle}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-colors ${
              isWishlisted 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-white/90 text-neutral-800 hover:bg-neutral-900 hover:text-white"
            }`}
            title="Add to Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleQuickViewOpen}
            className="p-2.5 rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md transition-colors hover:bg-neutral-900 hover:text-white"
            title="Quick View"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Details Box */}
      <div className="flex flex-col flex-grow pt-4 pb-3 px-3">
        {/* Category */}
        <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
          {categoryName}
        </span>

        {/* Product Name (capped at 2 lines) */}
        <Link 
          to={`/product/${product.id}`} 
          className="text-sm font-medium text-neutral-800 line-clamp-2 hover:text-neutral-900 transition-colors mb-2 min-h-10 flex items-start"
        >
          {product.name}
        </Link>

        {/* Price & Cart button aligned */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-neutral-50">
          <span className="text-base font-semibold text-neutral-900">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-semibold tracking-wide uppercase transition-colors ${
              product.stockQuantity === 0
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            <ShoppingBag size={13} />
            {product.stockQuantity === 0 ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>

      {/* MATERIAL-UI QUICK VIEW DIALOG */}
      <Dialog 
        open={quickViewOpen} 
        onClose={handleQuickViewClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          className: "rounded-none !m-4"
        }}
        slotProps={{
          backdrop: {
            className: "backdrop-blur-xs"
          }
        }}
      >
        <div className="relative">
          <button
            onClick={handleQuickViewClose}
            className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>

          <DialogContent className="!p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image Panel */}
              <div className="aspect-4/5 bg-neutral-50 overflow-hidden">
                <img
                  src={IMAGE_BASE_URL + product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Product Info Panel */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                      {categoryName}
                    </span>
                    <ProductBadge stockQuantity={product.stockQuantity} categoryProductId={product.categoryProductId} />
                  </div>

                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 leading-snug">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <Rating value={ratingMockValue} precision={0.5} readOnly size="small" />
                    <span className="text-xs text-neutral-500 font-mono">
                      {ratingMockValue} / 5.0 Rating
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-black text-neutral-900 mb-4 font-mono">
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                    {product.description || "Experience supreme ease with our signature fashion products. High-quality stitching, durable colorfastness, and tailored for absolute modern confidence."}
                  </p>

                  {/* Sizes (Muji/Uniqlo feel) */}
                  <div className="mb-6">
                    <span className="block text-xs font-semibold uppercase text-neutral-500 tracking-wider mb-2">
                      Select Size: {selectedSize}
                    </span>
                    <div className="flex gap-2">
                      {["XS", "S", "M", "L", "XL"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 border text-xs font-bold transition-all ${
                            selectedSize === size
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex gap-4">
                  <button
                    onClick={handleQuickViewAddToCart}
                    disabled={product.stockQuantity === 0}
                    className={`flex-grow h-12 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide uppercase transition-colors ${
                      product.stockQuantity === 0
                        ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    <ShoppingBag size={16} />
                    {product.stockQuantity === 0 ? "Out of Stock" : "Add To Bag"}
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => setQuickViewOpen(false)}
                    className="h-12 w-12 border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-all"
                    title="View Details Page"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductCard;
