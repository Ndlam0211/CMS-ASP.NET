import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ShopPagination = ({
  totalPages,
  activePage,
  loading,
  updateQueryParam,
}) => {
  if (totalPages <= 1 || loading) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-t border-neutral-100 pt-8 mt-4">
      <button
        onClick={() => updateQueryParam("page", String(activePage - 1))}
        disabled={activePage <= 1}
        className="h-10 w-10 border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 disabled:opacity-45 disabled:pointer-events-none transition-colors"
        title="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        const isCurrent = activePage === pageNum;
        return (
          <button
            key={pageNum}
            onClick={() => updateQueryParam("page", String(pageNum))}
            className={`h-10 w-10 text-xs font-bold transition-colors ${
              isCurrent
                ? "bg-neutral-900 text-white border border-neutral-900"
                : "border border-neutral-200 text-neutral-600 hover:border-neutral-900"
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => updateQueryParam("page", String(activePage + 1))}
        disabled={activePage >= totalPages}
        className="h-10 w-10 border border-neutral-200 hover:border-neutral-900 flex items-center justify-center text-neutral-600 disabled:opacity-45 disabled:pointer-events-none transition-colors"
        title="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
