import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, FolderHeart } from "lucide-react";
import ProductCard from "../../components/product/ProductCard";
import ProductSkeleton from "../../components/product/ProductSkeleton";
import "swiper/css";
import "swiper/css/navigation";

export const FeaturedProductsSection = ({
  products,
  loading,
  error,
  categories,
}) => {
  const swiperRef = useRef(null);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  const handleMouseEnter = () => {
    if (swiperRef.current?.swiper.autoplay) {
      swiperRef.current.swiper.autoplay.stop();
      setIsAutoplayActive(false);
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current?.swiper.autoplay) {
      swiperRef.current.swiper.autoplay.start();
      setIsAutoplayActive(true);
    }
  };

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-neutral-100 pt-16">
        <div className="text-center sm:text-left mb-8">
          <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
            Selected Staples
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
            Featured Staples
          </h2>
        </div>
        <div className="bg-red-50 border border-dashed border-red-200 p-6 text-center text-red-700">
          <p className="text-sm font-semibold">
            Failed to load featured products
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
            Selected Staples
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
            Featured Staples
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-neutral-200">
          <FolderHeart className="text-neutral-300 w-12 h-12 mb-4 stroke-1" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-1">
            Không có dữ liệu để hiển thị
          </h3>
          <p className="text-xs text-neutral-400 text-center max-w-sm">
            Chúng tôi không tìm thấy sản phẩm nổi bật nào trong danh mục này.
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-neutral-100 pt-16">
        <div className="text-center sm:text-left mb-8">
          <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
            Selected Staples
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
            Featured Staples
          </h2>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Premium products engineered for the capsule wardrobe.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-neutral-100 pt-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="text-center sm:text-left mb-8">
        <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
          Selected Staples
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-wider mt-1">
          Featured Staples
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Premium products engineered for the capsule wardrobe.
        </p>
      </div>

      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          }}
          onSlideChange={() => {}}
          className="featured-carousel"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} categories={categories} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 lg:-translate-x-16 z-10 bg-neutral-900 text-white rounded-full p-2 hover:bg-neutral-800 transition-colors disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 lg:translate-x-16 z-10 bg-neutral-900 text-white rounded-full p-2 hover:bg-neutral-800 transition-colors disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <style>{`
        .featured-carousel {
          padding: 0 !important;
        }
      `}</style>
    </section>
  );
};
