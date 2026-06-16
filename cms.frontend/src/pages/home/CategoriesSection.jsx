import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const CategoriesSection = ({ categories }) => {
  const [carouselPosition, setCarouselPosition] = useState(0);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  };

  const maxPosition = Math.max(0, categories.length - itemsPerView.desktop);

  const handlePrev = () => {
    setCarouselPosition((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselPosition((prev) => Math.min(maxPosition, prev + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center sm:text-left mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider">
            Curated Departments
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Shop by tailored collections
          </p>
        </div>
        <Link
          to="/shop"
          className="text-xs font-bold tracking-wider text-neutral-900 uppercase hover:underline inline-flex items-center gap-1.5"
        >
          View All Catalog <ArrowRight size={13} />
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Carousel Wrapper */}
        <div className="overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${carouselPosition * (100 / itemsPerView.desktop + 1.6)}%)`,
            }}
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop?categoryProductId=${category.id}`}
                className="group flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 bg-neutral-50 border border-neutral-200 p-6 hover:bg-neutral-100 hover:border-neutral-900 transition-all duration-300"
              >
                <div className="flex flex-col gap-3 h-full justify-between">
                  <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider leading-tight">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Browse
                    </span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        {categories.length > itemsPerView.desktop && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={carouselPosition === 0}
              className="h-10 w-10 border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 disabled:opacity-45 disabled:pointer-events-none transition-colors"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({
                length: categories.length - itemsPerView.desktop + 1,
              }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselPosition(idx)}
                  className={`h-2 rounded-full transition-all ${
                    carouselPosition === idx
                      ? "bg-neutral-900 w-6"
                      : "bg-neutral-300 w-2 hover:bg-neutral-500"
                  }`}
                  title={`Go to position ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={carouselPosition >= maxPosition}
              className="h-10 w-10 border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 disabled:opacity-45 disabled:pointer-events-none transition-colors"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
