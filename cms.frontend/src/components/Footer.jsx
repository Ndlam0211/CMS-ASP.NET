import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ handleNewsletterSubmit }) => {
  return (
    <footer className="mt-auto border-t border-neutral-150 bg-white grid grid-cols-1 lg:grid-cols-4 font-sans text-xs">
      {/* Newsletter joint section */}
      <div className="lg:col-span-2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-neutral-150 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 pr-0 md:pr-8">
          <h4 className="text-sm font-bold font-display uppercase tracking-widest mb-2 text-neutral-950">
            Join the Circle
          </h4>
          <p className="text-neutral-500 leading-relaxed text-xs">
            Exclusive previews, seasonal updates, and capsular log archives.
          </p>
        </div>
        <form
          onSubmit={handleNewsletterSubmit}
          className="relative flex-1 w-full"
        >
          <input
            type="email"
            name="newsEmail"
            required
            placeholder="Your email"
            className="w-full border-b border-neutral-300 pb-2 text-xs focus:border-black outline-none bg-transparent"
          />
          <button
            type="submit"
            className="absolute right-0 bottom-2 text-[10px] font-bold uppercase tracking-wider text-neutral-950 hover:text-neutral-500 font-display"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Directory links column */}
      <div className="col-span-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-neutral-150">
        <h4 className="text-[11px] font-bold font-display uppercase tracking-widest mb-4 text-neutral-400">
          Discover
        </h4>
        <div className="flex flex-col gap-2.5">
          <Link
            to="/shop"
            className="text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            Catalog / Archives
          </Link>
          <Link
            to="/blog"
            className="text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            Stories & Notes
          </Link>
          <a
            href="#"
            className="text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            Our Ethos
          </a>
        </div>
      </div>

      {/* Follow / Policies column */}
      <div className="col-span-1 p-8 lg:p-12">
        <h4 className="text-[11px] font-bold font-display uppercase tracking-widest mb-4 text-neutral-400">
          Policy
        </h4>
        <div className="flex flex-col gap-2.5">
          <a
            href="#"
            className="text-neutral-800 hover:text-neutral-500 transition-colors"
          >
            Free Shipping & Returns
          </a>
          <span className="text-neutral-400 mt-1 font-mono">
            support@atelier.com
          </span>
          <p className="text-[10px] text-neutral-405 italic pt-2 border-t border-neutral-100">
            © {new Date().getFullYear()} ATELIER STUDIO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
