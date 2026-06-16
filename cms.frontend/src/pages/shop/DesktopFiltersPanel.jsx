import React from "react";
import { Search, ChevronRight } from "lucide-react";

export const DesktopFiltersPanel = ({
  categories,
  activeCategory,
  activeSearch,
  activeSort,
  localSearch,
  setLocalSearch,
  handleSearchSubmit,
  handleCategorySelect,
  updateQueryParam,
  handleClearAllFilters,
}) => {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="flex flex-col gap-6 sticky top-28">
        {/* Search filter panel */}
        <div className="border-b border-neutral-100 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
            Search Catalog
          </h3>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Type keyword..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-neutral-50 text-xs border border-neutral-200 pl-3 pr-8 py-2 focus:outline-none focus:border-neutral-800 transition-all placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Category filter panel */}
        <div className="border-b border-neutral-100 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
            Collections
          </h3>
          <div className="flex flex-col space-y-1.5">
            <button
              onClick={() => updateQueryParam("categoryProductId", "")}
              className={`text-left text-xs py-1 transition-all flex items-center justify-between ${
                activeCategory === ""
                  ? "font-bold text-neutral-950 pl-1 border-l-2 border-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900 hover:pl-1"
              }`}
            >
              <span>All Clothing</span>
              <span className="text-[10px] font-mono text-neutral-400">
                / All
              </span>
            </button>
            {categories.map((cat) => {
              const isActive = activeCategory === String(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`text-left text-xs py-1 transition-all flex items-center justify-between ${
                    isActive
                      ? "font-bold text-neutral-950 pl-1 border-l-2 border-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900 hover:pl-1"
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronRight size={10} className="opacity-40" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Sorter panel */}
        <div className="border-b border-neutral-100 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
            Sort Pricing
          </h3>
          <select
            value={activeSort}
            onChange={(e) => updateQueryParam("sortPrice", e.target.value)}
            className="w-full bg-neutral-50 text-xs border border-neutral-200 px-3 py-2 focus:outline-none focus:border-neutral-800"
          >
            <option value="">Default Catalog order</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        {/* Clear All button */}
        {(activeCategory || activeSearch || activeSort) && (
          <button
            onClick={handleClearAllFilters}
            className="w-full text-center border border-dashed border-red-200 text-red-600 hover:bg-red-50 py-2 text-xs font-semibold tracking-wide transition-colors"
          >
            Clear Active Filters
          </button>
        )}
      </div>
    </aside>
  );
};
