import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const HeroBanner = () => {
  return (
    <section className="relative bg-neutral-950 text-white min-h-[60vh] sm:min-h-[75vh] flex items-center overflow-hidden">
      {/* Modern high contrast background overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?max&w=1600"
          alt="Atelier Banner"
          className="w-full h-full object-cover grayscale contrast-125"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-neutral-950/60 z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16">
        <div className="max-w-3xl flex flex-col gap-6">
          <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-neutral-400 uppercase tracking-widest mb-2">
            <Sparkles size={11} className="text-neutral-300" />
            Seasonal Essentials
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tighter leading-[0.85] text-white uppercase">
            MINIMALISM
            <br />
            DEFINED
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-400 max-w-md my-2 leading-relaxed">
            Drafted with architectural precision, crafted from long-staple
            organic materials. Refined seasonal elements built to resist trend
            cycles.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-white text-neutral-950 font-bold text-xs tracking-widest uppercase hover:bg-neutral-100 transition-colors"
            >
              Explore Collection
            </Link>
            <Link
              to="/blog"
              className="px-8 py-3.5 border border-white text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-neutral-950 transition-colors"
            >
              Read Stories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
