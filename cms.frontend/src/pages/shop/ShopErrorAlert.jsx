import React from "react";
import { CircleAlert } from "lucide-react";

export const ShopErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-dashed border-red-200 p-6 flex items-center gap-3 text-red-700 rounded-none">
      <CircleAlert className="h-6 w-6 stroke-1 flex-shrink-0" />
      <div>
        <h4 className="font-bold text-sm">E-commerce API Error</h4>
        <p className="text-xs">{error}</p>
      </div>
    </div>
  );
};
