import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  ShoppingBag, 
  CheckCircle, 
  CreditCard, 
  MapPin, 
  Truck, 
  CircleAlert, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { submitOrderThunk, clearSubmitStatus } from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

// Define Form validation schema with Yup as requested
const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required").min(3, "Too short"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Delivery address is required").min(10, "Please provide full delivery address"),
  paymentMethod: yup.string().required("Payment method is required"),
  notes: yup.string().optional()
});

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux States
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { lastSubmittedOrder, submitLoading, submitError } = useSelector((state) => state.orders);

  const [checkoutStep, setCheckoutStep] = useState("form"); // "form" | "success"
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // Math totals
  const shippingCost = totalAmount >= 150 ? 0 : 15;
  const taxCost = totalAmount * 0.08;
  const grandTotal = totalAmount + shippingCost + taxCost;

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      paymentMethod: "cod",
      notes: ""
    }
  });

  // Keep fields synchronized if user logs in on checkout page
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate("/login?redirect=/checkout");
    } else if (user) {
      setValue("fullName", user.fullName || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
      setValue("address", user.address || "");
    }
  }, [user, isAuthenticated, setValue, navigate]);

  // Handle Order Submit
  const handlePlaceOrder = async (formData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Determine customer ID (fallback to mock customer ID if guest)
    const customerId = user?.id || 101; 

    const orderPayload = {
      customerId,
      shippingAddress: formData.address,
      notes: formData.notes || `Deliver to: ${formData.fullName} - ${formData.phone}`,
      items: items.map((item) => ({
        id: item.id,
        productId: item.id, // match database schema
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        unitPrice: item.price
      })),
      totalAmount: grandTotal
    };

    // Dispatch Order post
    const result = await dispatch(submitOrderThunk(orderPayload));
    
    if (submitOrderThunk.fulfilled.match(result)) {
      const orderId = result.payload.orderId || Math.floor(Math.random() * 90000) + 10000;
      setPlacedOrderId(orderId);
      setCheckoutStep("success");
      dispatch(clearCart()); // Empty selections
      toast.success("Đặt hàng thành công! Thank you.", { duration: 4000 });
    } else {
      toast.error("Unable to place order. Testing offline mode instead.");
    }
  };

  // Clean order submit on unload/mount
  useEffect(() => {
    return () => {
      dispatch(clearSubmitStatus());
    };
  }, [dispatch]);

  // 1. SUCCESS STATE VIEW
  if (checkoutStep === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-emerald-500 mb-6 stroke-1 animate-bounce" />
        
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-3">
          Đặt hàng thành công!
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-widest mb-2">
          Purchase Confirmed
        </h1>
        
        <p className="text-sm font-mono text-neutral-500 mb-6">
          Order ID: <span className="font-bold text-neutral-900 bg-neutral-100 px-2.5 py-1">ORD-{placedOrderId}</span>
        </p>

        <div className="bg-neutral-50 border border-neutral-150 p-6 text-left w-full rounded-none mb-8 text-xs flex flex-col gap-3 font-sans">
          <h4 className="font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-200 pb-1.5">
            Shipping & Fulfilment details
          </h4>
          <p className="leading-relaxed text-neutral-600">
            We are preparing your package beautifully in our warehouse. Packaged using 100% biodegradable fiber papers. 
          </p>
          <div className="flex flex-col gap-1.5 font-mono text-neutral-500 pt-1">
            <div>• <span className="font-bold">Dispatch Schedule</span>: Dispatches within 24-48 hours.</div>
            <div>• <span className="font-bold">Shipping Provider</span>: DHL Premium / VNPost Express.</div>
            <div>• <span className="font-bold">Timeline</span>: 2-4 working business days.</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link 
            to="/account/orders" 
            className="flex-grow bg-neutral-900 text-white font-bold text-xs tracking-widest uppercase h-12 flex items-center justify-center hover:bg-neutral-800 transition-colors"
          >
            Track Order History
          </Link>
          <Link 
            to="/shop" 
            className="flex-grow border border-neutral-250 text-neutral-800 hover:text-neutral-950 hover:border-neutral-950 font-bold text-xs tracking-widest uppercase h-12 flex items-center justify-center transition-colors bg-white"
          >
            Go back to shop
          </Link>
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE REDIRECT
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center">
        <ShoppingBag className="w-12 h-12 text-neutral-300 stroke-1 mb-4" />
        <h2 className="text-xl font-bold uppercase text-neutral-900 mb-1">No selections selected</h2>
        <p className="text-xs text-neutral-400 mb-6">You need to have clothing items inside your shopping basket before checking out.</p>
        <Link to="/shop" className="bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest h-11 px-6 inline-flex items-center justify-center">
          Go To Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* breadcrumbs */}
      <nav className="text-[10px] font-mono tracking-wide text-neutral-400 uppercase mb-8 flex items-center gap-1.5">
        <Link to="/cart" className="hover:text-neutral-900 transition-colors flex items-center gap-1 hover:underline">
          <ArrowLeft size={10} /> Selections Bag
        </Link>
        <ChevronRight size={10} className="text-neutral-300" />
        <span className="text-neutral-800 font-bold">Secure Checkout</span>
      </nav>

      {/* Grid Layout splits forms & items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: Shipping info form */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-wider uppercase mb-1">
              Shipping & Billing
            </h1>
            <p className="text-xs text-neutral-400">
              Provide trackable courier information below.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-150 p-4 text-xs text-neutral-600 flex items-center justify-between gap-4 font-mono">
            <span>Tài khoản: <strong className="text-neutral-900 font-bold">{user?.fullName || user?.email}</strong></span>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider bg-white px-2.5 py-1 border border-neutral-200">
              Profile Verified
            </span>
          </div>

          <form onSubmit={handleSubmit(handlePlaceOrder)} className="flex flex-col gap-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Emily Watson"
                  {...register("fullName")}
                  className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                    errors.fullName ? "border-red-400" : "border-neutral-200"
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[10px] font-mono text-red-500 font-bold">{errors.fullName.message}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. emily@gmail.com"
                  {...register("email")}
                  className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                    errors.email ? "border-red-400" : "border-neutral-200"
                  }`}
                />
                {errors.email && (
                  <span className="text-[10px] font-mono text-red-500 font-bold">{errors.email.message}</span>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                Telephone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. +1 (555) 0192"
                {...register("phone")}
                className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                  errors.phone ? "border-red-400" : "border-neutral-200"
                }`}
              />
              {errors.phone && (
                <span className="text-[10px] font-mono text-red-500 font-bold">{errors.phone.message}</span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                Full Shipping Address
              </label>
              <input
                type="text"
                placeholder="Street address, Apartment, City, Postal Code"
                {...register("address")}
                className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                  errors.address ? "border-red-400" : "border-neutral-200"
                }`}
              />
              {errors.address && (
                <span className="text-[10px] font-mono text-red-500 font-bold">{errors.address.message}</span>
              )}
            </div>

            {/* Order Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                Delivery Instructions / Notes (Optional)
              </label>
              <textarea
                placeholder="Any shipping requests, gate codes, or delivery schedules..."
                rows={3}
                {...register("notes")}
                className="border border-neutral-200 text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
              />
            </div>

            {/* Payment Slices */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 block border-b border-neutral-100 pb-1.5">
                Select Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="border border-neutral-200 p-4 flex gap-3 items-center cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    value="cod"
                    defaultChecked
                    {...register("paymentMethod")}
                    className="accent-neutral-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Cash On Delivery (COD)</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Pay cash when package arrives</span>
                  </div>
                </label>
                <label className="border border-neutral-200 p-4 flex gap-3 items-center opacity-70 cursor-not-allowed bg-neutral-50/50">
                  <input
                    type="radio"
                    disabled
                    value="card"
                    {...register("paymentMethod")}
                    className="accent-neutral-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-400 block flex items-center gap-1">
                      Online Credit Card <CreditCard size={11} />
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Temporarily suspended for audits</span>
                  </div>
                </label>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 p-3 flex gap-2 items-center text-xs text-red-700">
                <CircleAlert size={14} />
                <span>Authentication checkout state error: {submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="mt-4 bg-neutral-950 text-white font-bold text-xs tracking-widest uppercase h-13 flex items-center justify-center gap-1.5 hover:bg-neutral-850 disabled:opacity-50 transition-colors"
            >
              {submitLoading ? "Processing order..." : "Place order - pay on arrival"}
            </button>

          </form>

        </div>

        {/* RIGHT COLUMN: Order summary list */}
        <aside className="lg:col-span-5 bg-neutral-50 border border-neutral-150 p-6 sticky top-28 height-fit">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200 pb-3 mb-4">
            Items Basket
          </h3>

          <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 justify-between items-start text-xs border-b border-neutral-100 pb-4">
                <div className="w-10 aspect-4/5 overflow-hidden bg-white border border-neutral-200 flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <span className="font-bold text-neutral-800 line-clamp-1 block">{item.name}</span>
                  <span className="font-mono text-neutral-400 block text-[10px]">
                    Qty: {item.quantity} × Size: M
                  </span>
                </div>
                <div className="text-right font-bold text-neutral-900 font-mono">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 font-mono text-xs text-neutral-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery</span>
              {shippingCost === 0 ? (
                <span className="text-emerald-600 font-bold uppercase text-[10px]">Free</span>
              ) : (
                <span className="font-bold text-neutral-900">${shippingCost.toFixed(2)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-bold text-neutral-900">${taxCost.toFixed(2)}</span>
            </div>
            <hr className="border-neutral-200 my-1 pb-1" />
            <div className="flex justify-between text-neutral-900 font-black text-sm">
              <span className="uppercase">Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-100 font-mono text-[10px] text-neutral-400 leading-normal flex gap-2 items-start justify-center">
            <ShieldCheck size={16} className="text-neutral-500 stroke-1 flex-shrink-0 mt-0.5" />
            <span>By placing this order, you authorize ATELIER to dispatch items via verified local couriers. COD payable strictly in USD or local exchange equivalent.</span>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default CheckoutPage;
