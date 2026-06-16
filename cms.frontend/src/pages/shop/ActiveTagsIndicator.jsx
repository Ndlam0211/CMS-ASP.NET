import React from "react";
import { X } from "lucide-react";

export const ActiveTagsIndicator = ({
  activeSearch,
  activeCategory,
  activeSort,
  activeCategoryName,
  updateQueryParam,
  handleClearAllFilters,
}) => {
  if (!activeSearch && !activeCategory && !activeSort) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-50 border border-neutral-100">
      <span className="text-[10px] font-bold font-mono uppercase text-neutral-400">
        Active tags:
      </span>
      {activeCategory && (
        <span className="inline-flex items-center gap-1 bg-white border border-neutral-200 px-2 py-0.5 text-xs text-neutral-700">
          Collection: {activeCategoryName}
          <button
            onClick={() => updateQueryParam("categoryProductId", "")}
            className="p-0.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
          >
            <X size={10} />
          </button>
        </span>
      )}
      {activeSearch && (
        <span className="inline-flex items-center gap-1 bg-white border border-neutral-200 px-2 py-0.5 text-xs text-neutral-700">
          Query: "{activeSearch}"
          <button
            onClick={() => updateQueryParam("search", "")}
            className="p-0.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
          >
            <X size={10} />
          </button>
        </span>
      )}
      {activeSort && (
        <span className="inline-flex items-center gap-1 bg-white border border-neutral-200 px-2 py-0.5 text-xs text-neutral-700">
          Sort: {activeSort === "asc" ? "Price Low-High" : "Price High-Low"}
          <button
            onClick={() => updateQueryParam("sortPrice", "")}
            className="p-0.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
          >
            <X size={10} />
          </button>
        </span>
      )}
      <button
        onClick={handleClearAllFilters}
        className="text-[10px] font-bold uppercase text-neutral-400 hover:text-neutral-900 ml-auto"
      >
        Clear all
      </button>
    </div>
  );
};
