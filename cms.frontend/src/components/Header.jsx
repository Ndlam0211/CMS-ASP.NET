import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Search, Menu, X, LogOut } from "lucide-react";

const Header = ({
  scrolled,
  categories,
  isAuthenticated,
  user,
  totalQuantity,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  handleLogoutClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
          : "bg-white border-b border-neutral-150 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 hover:bg-neutral-100 text-neutral-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Premium Minimal Brand Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl sm:text-2xl font-black font-display tracking-tighter text-neutral-950 select-none uppercase"
            >
              ATELIER{" "}
              <span className="font-light text-neutral-400">STUDIO</span>
            </Link>
          </div>

          {/* Desktop Directory links (Zara / Aura style) */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/shop"
              className={`text-[13px] font-bold font-display uppercase tracking-tight transition-colors hover:text-neutral-500 ${
                location.pathname === "/shop"
                  ? "text-neutral-950 underline underline-offset-4"
                  : "text-neutral-500"
              }`}
            >
              Shop
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?categoryProductId=${cat.id}`}
                className="text-[13px] font-bold font-display uppercase tracking-tight text-neutral-400 hover:text-neutral-950 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/blog"
              className={`text-[13px] font-bold font-display uppercase tracking-tight transition-colors hover:text-neutral-500 ${
                location.pathname === "/blog"
                  ? "text-neutral-950 underline underline-offset-4"
                  : "text-neutral-500"
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Right Header: Search, Account & Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-grow lg:flex-grow-0 justify-end">
            {/* Search form bar desktop-centered */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:block w-40 lg:w-48"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs border-b border-transparent focus:border-black outline-none pb-1 transition-all placeholder:text-neutral-400 font-sans"
              />
              <Search
                size={14}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </form>

            {/* Account Profile Access */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account/orders"
                  className="p-1.5 hover:bg-neutral-50 text-neutral-800 hover:text-neutral-950 transition-all flex items-center gap-1 text-xs font-bold"
                >
                  <User size={16} />
                  <span className="hidden md:inline font-mono uppercase text-[11px] tracking-wider text-neutral-500">
                    Hi, {user.fullName?.split(" ")[0] || "User"}
                  </span>
                </Link>

                <button
                  onClick={handleLogoutClick}
                  className="p-1.5 hover:bg-neutral-50 text-neutral-400 hover:text-red-600 transition-all"
                  title="Log Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1.5 hover:bg-neutral-50 text-neutral-800 hover:text-neutral-950 transition-all flex items-center gap-1"
                title="Sign In / Register"
              >
                <User size={16} />
              </Link>
            )}

            {/* Shopping Cart Indicator */}
            <Link
              to="/cart"
              className="p-2.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors relative flex items-center justify-center rounded-none"
            >
              <ShoppingBag size={15} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-neutral-950 border border-neutral-800 text-white text-[9px] font-bold font-mono h-4 w-4 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu collapsible */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-neutral-200 py-4 px-6 shadow-md transition-all">
          <form
            onSubmit={handleSearchSubmit}
            className="relative mb-4 sm:hidden"
          >
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 text-xs border border-neutral-200 pl-8 pr-3 py-2 focus:outline-none"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </form>
          <div className="flex flex-col space-y-3.5">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold tracking-wider uppercase text-neutral-800 hover:text-neutral-950"
            >
              View Catalog
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?categoryProductId=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wider text-neutral-500 hover:text-neutral-900 pl-2 border-l border-neutral-100"
              >
                {cat.name}
              </Link>
            ))}
            <hr className="border-neutral-100 my-1" />
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-bold tracking-wider uppercase text-neutral-800"
            >
              Journals
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-neutral-600"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogoutClick();
                  }}
                  className="text-sm font-semibold text-red-500 text-left"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold tracking-wider uppercase text-neutral-900"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
