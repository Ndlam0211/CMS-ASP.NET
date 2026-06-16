import React from "react";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { FolderHeart } from "lucide-react";

export const ProductGrid = ({ products = [], loading = false, categories = [] }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-neutral-200">
        <FolderHeart className="text-neutral-300 w-12 h-12 mb-4 stroke-1" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-1">
          Không có dữ liệu để hiển thị
        </h3>
        <p className="text-xs text-neutral-400 text-center max-w-sm">
          Chúng tôi không tìm thấy sản phẩm nào trong danh mục này phù hợp với tiêu chí của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} categories={categories} />
      ))}
    </div>
  );
};

export default ProductGrid;
