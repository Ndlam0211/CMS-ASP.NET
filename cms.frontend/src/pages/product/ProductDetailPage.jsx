import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  ShoppingBag, 
  Heart, 
  Trash, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CircleAlert
} from "lucide-react";
import { getProductByIdThunk, getProductsThunk } from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import ProductBadge from "../../components/product/ProductBadge";
import ProductCard from "../../components/product/ProductCard";
import { IMAGE_BASE_URL } from "../../api/axiosClient";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux States
  const { currentProduct, detailLoading, detailError, products: allProducts } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch current product on mount / ID change
  useEffect(() => {
    dispatch(getProductByIdThunk(id));
    setQuantity(1); // Reset counter
  }, [dispatch, id]);

  // Fetch related products after product loads
  useEffect(() => {
    if (currentProduct?.categoryProductId) {
      dispatch(getProductsThunk({
        categoryProductId: currentProduct.categoryProductId,
        page: 1,
        pageSize: 5 // load 5, filter out self to show 4
      }));
    }
  }, [dispatch, currentProduct]);

  if (detailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="aspect-4/5 bg-neutral-200" />
          <div className="flex flex-col gap-4 py-4">
            <div className="h-4 bg-neutral-200 rounded-sm w-1/4" />
            <div className="h-10 bg-neutral-200 rounded-sm w-3/4" />
            <div className="h-6 bg-neutral-200 rounded-sm w-1/3" />
            <hr className="border-neutral-100 my-4" />
            <div className="h-24 bg-neutral-200 rounded-sm w-full" />
            <div className="h-12 bg-neutral-200 rounded-sm w-1/2 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (detailError || !currentProduct) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <CircleAlert className="w-12 h-12 text-neutral-400 mx-auto mb-4 stroke-1" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          Unable To Load Product Details
        </h2>
        <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
          The requested apparel item could not be retrieved from the server. It may have been unlisted, or there could be a localized connection issue.
        </p>
        <Link 
          to="/shop" 
          className="bg-neutral-900 text-white font-bold text-xs tracking-widest uppercase h-11 px-8 inline-flex items-center justify-center transition-colors hover:bg-neutral-800"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Find Category Name
  const category = categories.find((c) => c.id === currentProduct.categoryProductId);
  const categoryName = category ? category.name : "Apparel Collection";

  // Filter out self from related products ribbon
  const relatedProducts = allProducts.filter((p) => p.id !== currentProduct.id).slice(0, 4);

  const incrementQty = () => {
    if (currentProduct.stockQuantity && quantity >= currentProduct.stockQuantity) {
      toast.warn(`Only ${currentProduct.stockQuantity} items in stock.`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decrementQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCartClick = () => {
    if (currentProduct.stockQuantity === 0) {
      toast.error("This item is currently out of stock");
      return;
    }
    dispatch(addToCart({ product: currentProduct, quantity }));
    toast.success(`Added ${quantity} × ${currentProduct.name} to bag!`, {
      position: "bottom-right"
    });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success("Saved to your wishlist!", { position: "bottom-right", autoClose: 1500 });
    } else {
      toast.info("Removed from your wishlist.", { position: "bottom-right", autoClose: 1500 });
    }
  };

  const ratingMockValue = (currentProduct.id % 2 === 0) ? 4.5 : 4.0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Menu */}
      <nav className="text-[11px] font-mono tracking-wide text-neutral-400 uppercase mb-8 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-neutral-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-neutral-900 transition-colors">
          Catalog
        </Link>
        <span>/</span>
        <Link
          to={`/shop?categoryProductId=${currentProduct.categoryProductId}`}
          className="hover:text-neutral-900 transition-colors"
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-neutral-800 font-bold truncate max-w-xs">
          {currentProduct.name}
        </span>
      </nav>

      {/* Main info panel layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start mb-24">
        {/* LEFT COLUMN: Premium High-Res image panel */}
        <div className="border border-neutral-100 overflow-hidden bg-neutral-50 aspect-4/5 w-full">
          <img
            src={IMAGE_BASE_URL + currentProduct.imageUrl}
            alt={currentProduct.name}
            className="w-full h-full object-cover transition-all"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* RIGHT COLUMN: Styling particulars */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex gap-2 items-center mb-2">
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                {categoryName}
              </span>
              <ProductBadge
                stockQuantity={currentProduct.stockQuantity}
                categoryProductId={currentProduct.categoryProductId}
              />
            </div>

            <h1 className="text-2xl sm:text-3.5xl font-black text-neutral-900 uppercase tracking-wide leading-tight mb-3">
              {currentProduct.name}
            </h1>

            {/* Simulated Reviews rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-sm">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-neutral-500 font-mono">
                {ratingMockValue} ({currentProduct.id * 3 + 12} Verified Audits)
              </span>
            </div>

            {/* Pricing Tag */}
            <div className="text-3xl font-black text-neutral-950 font-mono">
              {currentProduct.price.toLocaleString("vi-VN")} ₫
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Philosophical Description
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {currentProduct.description ||
                "Indulge in tailored comfort with our signature garment. Built with refined double-stitched reinforcements, lightweight yet durable textile architectures, and colored using low-impact natural processes. Adapts smoothly to changing seasons for effortless smart-casual layouts."}
            </p>
          </div>

          {/* Size Selectors */}
          <div>
            <span className="block text-xs font-bold uppercase text-neutral-500 tracking-wider mb-2">
              Select Size: {selectedSize}
            </span>
            <div className="flex gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 border text-xs font-bold transition-all ${
                    selectedSize === size
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity modifies & actions block */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-neutral-100">
            {/* Quantity Selector */}
            <div className="flex items-center border border-neutral-200 h-12 w-full sm:w-32 bg-white">
              <button
                onClick={decrementQty}
                className="w-10 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                title="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="flex-grow text-center text-xs font-mono font-bold text-neutral-900">
                {quantity}
              </span>
              <button
                onClick={incrementQty}
                className="w-10 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                title="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>

            {/* Add to Bag and Wishlist */}
            <div className="flex-grow flex gap-2">
              <button
                onClick={handleAddToCartClick}
                disabled={currentProduct.stockQuantity === 0}
                className={`flex-grow h-12 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors ${
                  currentProduct.stockQuantity === 0
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-950 text-white hover:bg-neutral-850"
                }`}
              >
                <ShoppingBag size={14} />
                {currentProduct.stockQuantity === 0
                  ? "Out of Stock"
                  : "Add To Bag"}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
                }`}
                title="Add to wishlist"
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>

          {/* Shipping signals bar */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50/55 border border-neutral-100 font-mono text-[10px] text-neutral-500">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-neutral-800 flex-shrink-0" />
              <span>Complimentary Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={14} className="text-neutral-800 flex-shrink-0" />
              <span>30 Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={14}
                className="text-neutral-800 flex-shrink-0"
              />
              <span>Genuine Cotton Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS SLATE CORRIDOR */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="border-b border-neutral-100 pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                You May Also Match
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Frequently matched from {categoryName}
              </p>
            </div>
            <Link
              to={`/shop?categoryProductId=${currentProduct.categoryProductId}`}
              className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline"
            >
              Explore Collection
            </Link>
          </div>

          {/* Simple grid reuse */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} categories={categories} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
