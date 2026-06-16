import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getProductsThunk } from "../../store/slices/productSlice";
import { getCategoriesThunk } from "../../store/slices/categorySlice";
import ProductGrid from "../../components/product/ProductGrid";
import { ShopHeader } from "./ShopHeader";
import { DesktopFiltersPanel } from "./DesktopFiltersPanel";
import { MobileFilterBar } from "./MobileFilterBar";
import { MobileFiltersDrawer } from "./MobileFiltersDrawer";
import { ActiveTagsIndicator } from "./ActiveTagsIndicator";
import { ShopErrorAlert } from "./ShopErrorAlert";
import { ShopPagination } from "./ShopPagination";

export const ShopPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux States
  const { products, currentPage, totalPages, totalItems, loading, error } =
    useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories,
  );

  // Parse filters from URL Search Parameters
  const activeCategory = searchParams.get("categoryProductId") || "";
  const activeSearch = searchParams.get("search") || "";
  const activeSort = searchParams.get("sortPrice") || "";
  const activePage = parseInt(searchParams.get("page") || "1");

  const [localSearch, setLocalSearch] = useState(activeSearch);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL search string changes directly
  useEffect(() => {
    setLocalSearch(activeSearch);
  }, [activeSearch]);

  // Load Categories & Products on filters change
  useEffect(() => {
    dispatch(getCategoriesThunk());
    dispatch(
      getProductsThunk({
        categoryProductId: activeCategory,
        search: activeSearch,
        sortPrice: activeSort,
        page: activePage,
        pageSize: 8,
      }),
    );
  }, [dispatch, activeCategory, activeSearch, activeSort, activePage]);

  // Handle updates to query params helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === "" || value === undefined || value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    // Always reset to page 1 on filter changes
    if (key !== "page") {
      newParams.set("page", "1");
    }

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam("search", localSearch.trim());
  };

  const handleClearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalSearch("");
  };

  const handleCategorySelect = (id) => {
    const currentActive = activeCategory === String(id);
    updateQueryParam("categoryProductId", currentActive ? "" : String(id));
  };

  const activeCategoryName =
    categories.find((c) => String(c.id) === activeCategory)?.name ||
    "All Collections";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <ShopHeader
        activeCategoryName={activeCategoryName}
        productsCount={products.length}
        totalItems={totalItems}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel - Desktop */}
        <DesktopFiltersPanel
          categories={categories}
          activeCategory={activeCategory}
          activeSearch={activeSearch}
          activeSort={activeSort}
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          handleSearchSubmit={handleSearchSubmit}
          handleCategorySelect={handleCategorySelect}
          updateQueryParam={updateQueryParam}
          handleClearAllFilters={handleClearAllFilters}
        />

        {/* Main Catalog Column */}
        <div className="flex-grow flex flex-col gap-10">
          {/* Mobile Filter Bar */}
          <MobileFilterBar
            activeSort={activeSort}
            updateQueryParam={updateQueryParam}
            onFiltersClick={() => setShowMobileFilters(true)}
          />

          {/* Mobile Filters Drawer */}
          <MobileFiltersDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            categories={categories}
            activeCategory={activeCategory}
            localSearch={localSearch}
            setLocalSearch={setLocalSearch}
            handleCategorySelect={handleCategorySelect}
            handleSearchSubmit={handleSearchSubmit}
            handleClearAllFilters={handleClearAllFilters}
            updateQueryParam={updateQueryParam}
          />

          {/* Active Tags Indicator */}
          <ActiveTagsIndicator
            activeSearch={activeSearch}
            activeCategory={activeCategory}
            activeSort={activeSort}
            activeCategoryName={activeCategoryName}
            updateQueryParam={updateQueryParam}
            handleClearAllFilters={handleClearAllFilters}
          />

          {/* Error Alert or Catalog Grid */}
          {error ? (
            <ShopErrorAlert error={error} />
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              categories={categories}
            />
          )}

          {/* Pagination */}
          <ShopPagination
            totalPages={totalPages}
            activePage={activePage}
            loading={loading}
            updateQueryParam={updateQueryParam}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
