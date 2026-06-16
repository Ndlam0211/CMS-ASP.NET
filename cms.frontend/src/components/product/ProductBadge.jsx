import React from "react";
import clsx from "clsx";

export const ProductBadge = ({ stockQuantity, categoryProductId }) => {
  let text = "";
  let classes = "";

  if (stockQuantity === 0) {
    text = "Out of Stock";
    classes = "bg-red-50 text-red-700 border-red-200";
  } else if (stockQuantity <= 15) {
    text = `Only ${stockQuantity} Left`;
    classes = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (categoryProductId === 1 || categoryProductId === 3) {
    text = "New Room";
    classes = "bg-neutral-900 text-white border-neutral-900";
  } else if (stockQuantity > 40) {
    text = "Best Seller";
    classes = "bg-neutral-100 text-neutral-800 border-neutral-200";
  }

  return (
    <span
      className={clsx(
        "inline-block rounded-xs border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
        classes
      )}
    >
      {text}
    </span>
  );
};

export default ProductBadge;
