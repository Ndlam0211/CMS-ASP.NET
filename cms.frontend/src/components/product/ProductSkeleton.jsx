import React from "react";

export const ProductSkeleton = () => {
  return (
    <div className="group flex flex-col h-full animate-pulse">
      {/* 4:5 Aspect Ratio skeleton */}
      <div className="relative w-full aspect-4/5 bg-neutral-200" />
      
      <div className="flex flex-col flex-grow pt-3 pb-2 px-1">
        <div className="h-4 bg-neutral-200 rounded-sm w-1/3 mb-2" />
        <div className="h-5 bg-neutral-200 rounded-sm w-3/4 mb-1" />
        <div className="h-5 bg-neutral-200 rounded-sm w-1/2 mb-3" />
        
        <div className="mt-auto pt-2 flex justify-between items-center">
          <div className="h-6 bg-neutral-200 rounded-sm w-1/4" />
          <div className="h-9 bg-neutral-200 rounded-sm w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
