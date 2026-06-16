import React from "react";
import ProductGrid from "../../components/product/ProductGrid";

export const LatestArrivalsSection = ({
  products,
  loading,
  error,
  categories,
}) => {
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-neutral-100 pt-16">
        <div className="text-center sm:text-left mb-8">
          <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
            New Releases
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
            New Releases
          </h2>
        </div>
        <div className="bg-red-50 border border-dashed border-red-200 p-6 text-center text-red-700">
          <p className="text-sm font-semibold">
            Failed to load latest products
          </p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </section>
    );
  }

  if (!loading && (!products || products.length === 0)) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-neutral-100 pt-16">
        <div className="text-center sm:text-left mb-8">
          <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
            New Releases
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
            New Releases
          </h2>
        </div>
        <div className="text-center py-12 text-neutral-500">
          <p className="text-sm">No new releases available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-neutral-100 pt-16">
      <div className="text-center sm:text-left mb-8">
        <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
          New Releases
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
          New Releases
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          The newest curated editions fresh from our design studio.
        </p>
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        categories={categories}
      />
    </section>
  );
};
