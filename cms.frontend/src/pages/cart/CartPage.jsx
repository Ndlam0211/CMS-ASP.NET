import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck,
  Percent
} from "lucide-react";
import { 
  removeFromCart, 
  updateCartQuantity 
} from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../../api/axiosClient";

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Active Redux State
  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQtyChange = (id, currentQty, stock, increment) => {
    let newQty = currentQty;
    if (increment) {
      if (stock && currentQty >= stock) {
        toast.warn(`Capped! Only ${stock} items available in stock.`);
        return;
      }
      newQty += 1;
    } else {
      newQty -= 1;
    }

    if (newQty < 1) {
      dispatch(removeFromCart(id));
      toast.info("Item removed from bag.");
    } else {
      dispatch(updateCartQuantity({ id, quantity: newQty }));
    }
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.info(`Removed ${name} from bag.`);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.warn("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  // Math totals
  const shippingThreshold = 150;
  const shippingCost = totalAmount >= shippingThreshold || totalAmount === 0 ? 0 : 15;
  const estimatedTaxRate = 0.1; // 10% tax
  const taxCost = totalAmount * estimatedTaxRate;
  const grandTotal = totalAmount + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center">
        <div className="p-4 bg-neutral-50 rounded-full mb-6">
          <ShoppingBag className="w-12 h-12 text-neutral-400 stroke-1" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-widest mb-2">
          Không có dữ liệu để hiển thị
        </h2>
        <p className="text-sm text-neutral-500 max-w-sm mb-8 leading-relaxed">
          Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng để chọn cho mình những sản phẩm cao cấp chính hãng từ Atelier!
        </p>
        <Link 
          to="/shop" 
          className="bg-neutral-900 text-white font-bold text-xs tracking-widest uppercase h-12 px-8 flex items-center justify-center hover:bg-neutral-800 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6 mb-8">
        <span className="text-xs font-bold text-neutral-400 font-mono block mb-1">
          Your Selections
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-widest">
          Shopping Bag ({totalQuantity})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT COLUMN: Items list */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 sm:gap-6 py-5 border-b border-neutral-100 last:border-0"
            >
              {/* Product preview image ratio 4:5 */}
              <div className="w-24 sm:w-28 aspect-4/5 flex-shrink-0 bg-neutral-50 overflow-hidden border border-neutral-100">
                <Link to={`/product/${item.id}`}>
                  <img
                    src={IMAGE_BASE_URL + item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>
              </div>

              {/* Product details panel */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-sm sm:text-base font-bold text-neutral-950 hover:underline line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      title="Remove piece"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Size metadata placeholder (Uniqlo context) */}
                  <div className="text-[11px] text-neutral-400 font-mono mb-2 flex gap-3">
                    <span>
                      SIZE:{" "}
                      <span className="text-neutral-700 font-bold">M</span>
                    </span>
                    <span>•</span>
                    <span>
                      COLOR:{" "}
                      <span className="text-neutral-700 font-bold">
                        Default
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-4">
                  {/* Qty increments counter */}
                  <div className="flex items-center border border-neutral-200 h-9 w-28 bg-white">
                    <button
                      onClick={() =>
                        handleQtyChange(
                          item.id,
                          item.quantity,
                          item.stockQuantity,
                          false,
                        )
                      }
                      className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-all border-r border-neutral-100"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="flex-grow text-center text-xs font-bold font-mono text-neutral-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQtyChange(
                          item.id,
                          item.quantity,
                          item.stockQuantity,
                          true,
                        )
                      }
                      className="w-8 h-full flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-all border-l border-neutral-100"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Individual totals */}
                  <div className="text-right text-sm sm:text-base font-bold text-neutral-900 font-mono">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    <span className="block text-[10px] font-normal font-mono text-neutral-400">
                      {item.price.toLocaleString("vi-VN")} ₫ / each
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Secure signal indicator */}
          <div className="flex items-center gap-3.5 p-4 bg-neutral-50/50 border border-neutral-100 font-mono text-neutral-500 mt-6 text-xs leading-relaxed">
            <ShieldCheck size={20} className="text-neutral-700 flex-shrink-0" />
            <span>
              Your transaction is 256-bit SSL secured. We strictly protect your
              consumer privacy and data encryption boundaries.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Order checkout summaries card */}
        <aside className="bg-neutral-50 border border-neutral-100 p-6 sticky top-28 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
            Order Summary
          </h3>

          <div className="flex flex-col gap-3 font-mono text-xs text-neutral-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-neutral-900">
                ${totalAmount.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              {shippingCost === 0 ? (
                <span className="text-emerald-600 font-bold uppercase tracking-wide">
                  Free
                </span>
              ) : (
                <span className="font-bold text-neutral-900">
                  ${shippingCost.toLocaleString("vi-VN")} ₫
                </span>
              )}
            </div>
            {shippingCost > 0 && (
              <div className="text-[10px] text-neutral-400 bg-amber-50 p-2 border border-amber-100 leading-snug">
                Spend{" "}
                <span className="font-bold text-neutral-700">
                  ${(shippingThreshold - totalAmount).toLocaleString("vi-VN")} ₫
                </span>{" "}
                more to qualify for{" "}
                <span className="font-bold text-emerald-600">
                  FREE SHIPPING
                </span>
                !
              </div>
            )}
            {/* <div className="flex justify-between">
              <span>Estimated Tax (10%)</span>
              <span className="font-bold text-neutral-900">
                ${taxCost.toLocaleString("vi-VN")} ₫
              </span>
            </div> */}

            <hr className="border-neutral-100 my-2" />

            <div className="flex justify-between text-sm text-neutral-900 font-black">
              <span className="uppercase">Grand Total</span>
              <span>${grandTotal.toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-neutral-950 text-white font-bold text-xs tracking-widest uppercase h-12 flex items-center justify-center gap-1.5 hover:bg-neutral-850 transition-colors"
          >
            Proceed to Checkout
            <ArrowRight size={13} />
          </button>

          <Link
            to="/shop"
            className="w-full text-center text-neutral-500 hover:text-neutral-950 text-[10px] font-bold uppercase tracking-wider mt-4 block"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
