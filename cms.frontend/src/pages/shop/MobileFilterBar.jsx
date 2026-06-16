import React from "react";
import { SlidersHorizontal } from "lucide-react";

export const MobileFilterBar = ({
  activeSort,
  updateQueryParam,
  onFiltersClick,
}) => {
  return (
    <div className="lg:hidden flex gap-2 items-center w-full mb-4">
      <button
        onClick={onFiltersClick}
        className="flex-grow flex items-center justify-center gap-1.5 border border-neutral-200 py-2.5 text-xs font-semibold tracking-wide uppercase hover:bg-neutral-50 transition-colors"
      >
        <SlidersHorizontal size={14} />
        Filters / Collections
      </button>

      <select
        value={activeSort}
        onChange={(e) => updateQueryParam("sortPrice", e.target.value)}
        className="flex-shrink-0 bg-neutral-50 border border-neutral-200 text-xs font-semibold uppercase px-4 py-2.5"
      >
        <option value="">Sort: Default</option>
        <option value="asc">Price: Low-High</option>
        <option value="desc">Price: High-Low</option>
      </select>
    </div>
  );
};
