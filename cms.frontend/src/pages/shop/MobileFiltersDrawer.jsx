import React from "react";
import { X, Search } from "lucide-react";

export const MobileFiltersDrawer = ({
  isOpen,
  onClose,
  categories,
  activeCategory,
  activeMinPrice,
  activeMaxPrice,
  localSearch,
  setLocalSearch,
  localMinPrice,
  setLocalMinPrice,
  localMaxPrice,
  setLocalMaxPrice,
  handleCategorySelect,
  handleSearchSubmit,
  handleClearAllFilters,
  updateQueryParam,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-xs z-50 flex justify-end lg:hidden">
      <div className="w-80 bg-white h-full p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
            <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Customize Filters
            </span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 text-neutral-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Search */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Search Word
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchSubmit(e);
                  onClose();
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Type keyword..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-neutral-50 text-xs border border-neutral-200 pl-3 pr-8 py-2 focus:outline-none"
                />
                <Search
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </form>
            </div>

            {/* Collections list */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Filter Collections
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    updateQueryParam("categoryProductId", "");
                    onClose();
                  }}
                  className={`text-xs px-3 py-1.5 border transition-all ${
                    activeCategory === ""
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  All Clothing
                </button>
                {categories.map((cat) => {
                  const isActive = activeCategory === String(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategorySelect(cat.id);
                        onClose();
                      }}
                      className={`text-xs px-3 py-1.5 border transition-all ${
                        isActive
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Filter Price
              </h3>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min Price"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  className="w-full bg-neutral-50 text-xs border border-neutral-200 px-3 py-2 focus:outline-none"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max Price"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  className="w-full bg-neutral-50 text-xs border border-neutral-200 px-3 py-2 focus:outline-none"
                />
                <button
                  onClick={() => {
                    updateQueryParam("minPrice", localMinPrice);
                    updateQueryParam("maxPrice", localMaxPrice);
                    onClose();
                  }}
                  className="w-full bg-neutral-900 text-white text-xs py-2 font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Apply Price
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100">
          <button
            onClick={() => {
              handleClearAllFilters();
              onClose();
            }}
            className="w-full text-center bg-red-50 text-red-600 hover:bg-red-100 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};
