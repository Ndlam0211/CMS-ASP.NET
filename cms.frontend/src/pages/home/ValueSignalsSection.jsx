import React from "react";
import { Truck, ShieldCheck, TrendingUp } from "lucide-react";

export const ValueSignalsSection = () => {
  return (
    <section className="bg-neutral-50/50 border-t border-b border-neutral-100 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start gap-4 p-4 text-center md:text-left">
          <Truck className="w-8 h-8 text-neutral-800 mx-auto md:mx-0 stroke-1 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-1">
              Complimentary Shipping
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enjoy free trackable door-to-door delivery on all orders over
              $150. Packaged beautifully in eco-recycled boxes.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 text-center md:text-left">
          <ShieldCheck className="w-8 h-8 text-neutral-800 mx-auto md:mx-0 stroke-1 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-1">
              Guaranteed Materials
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              100% long-staple organic Egyptian cotton, raw selvedge denim, and
              certified sustainable wool with clean-dye processing.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 text-center md:text-left">
          <TrendingUp className="w-8 h-8 text-neutral-800 mx-auto md:mx-0 stroke-1 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-1">
              No-Hassle Exchanges
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Changed your mind? Return or exchange unworn pieces within 30
              days. We provide prepaid shipment labels instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
