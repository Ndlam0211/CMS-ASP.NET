import React from "react";

export const ShopHeader = ({
  activeCategoryName,
  productsCount,
  totalItems,
}) => {
  return (
    <div className="border-b border-neutral-100 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span className="text-xs font-bold text-neutral-400 font-mono block mb-1">
          Browse Atelier
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-widest">
          {activeCategoryName}
        </h1>
      </div>
      <div className="text-xs text-neutral-500 font-mono">
        Showing{" "}
        <span className="font-bold text-neutral-900">{productsCount}</span> of{" "}
        <span className="font-bold text-neutral-900">{totalItems}</span> products
      </div>
    </div>
  );
};
