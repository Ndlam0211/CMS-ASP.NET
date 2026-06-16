import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShoppingBag,
  CircleAlert,
  Loader,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getOrderHistoryThunk } from "../../store/slices/orderSlice";

export const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux States
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders, historyLoading, historyError } = useSelector((state) => state.orders);

  // Pagination states for high volume orders
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Redirect to login if guest tries to view accounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/account/orders");
    } else {
      console.log("Fetching order history for user:", user);
      dispatch(getOrderHistoryThunk(user.id));
    }
  }, [isAuthenticated, user, dispatch, navigate]);

  const totalOrders = orders ? orders.length : 0;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  // Auto-correct page bound if elements are deleted or updated
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 font-mono">
            Pending Approval
          </span>
        );
      case 1:
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 font-mono">
            Shipping Out
          </span>
        );
      case 2:
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 font-mono">
            Completed Fulfilled
          </span>
        );
      default:
        return (
          <span className="bg-neutral-50 text-neutral-600 border border-neutral-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 font-mono">
            In System Audit
          </span>
        );
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-neutral-400 font-mono block mb-1">
            Member Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-widest">
            Order Register History
          </h1>
        </div>
        
        {/* User Card */}
        <div className="bg-neutral-50 border border-neutral-150 p-4 flex gap-4 items-center text-xs self-start md:self-auto font-sans leading-relaxed">
          <div className="h-10 w-10 bg-neutral-900 text-white font-bold flex items-center justify-center font-mono rounded-none">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-extrabold text-neutral-950 block">{user.fullName}</span>
            <span className="text-neutral-400 block font-mono">{user.email}</span>
          </div>
        </div>
      </div>

      {historyLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-8 h-8 text-neutral-600 animate-spin mb-3 stroke-1" />
          <span className="text-xs font-mono text-neutral-400">Loading procurement audit registry...</span>
        </div>
      ) : historyError ? (
        <div className="bg-red-50 border border-dashed border-red-200 p-6 flex gap-3 text-red-700 items-center">
          <CircleAlert size={20} className="stroke-1" />
          <div>
            <h4 className="font-bold text-sm">Registry Audit Failure</h4>
            <p className="text-xs">{historyError}</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 flex flex-col items-center">
          <div className="p-4 bg-neutral-50 rounded-full mb-4">
            <ShoppingBag className="w-10 h-10 text-neutral-350 stroke-1" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Không có dữ liệu để hiển thị
          </h3>
          <p className="text-xs text-neutral-400 mt-1 mb-6 leading-relaxed max-w-xs">
            Bạn chưa thực hiện đơn đặt sản phẩm nào. Khi bạn tiến hành đặt hàng, lịch sử đơn hàng sẽ hiện lên tại đây.
          </p>
          <Link 
            to="/shop" 
            className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-bold tracking-widest uppercase transition-colors"
          >
            Start Shopping Catalog
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {currentOrders.map((order) => (
            <div 
              key={order.id}
              className="border border-neutral-150 p-6 flex flex-col gap-6 bg-white hover:shadow-subtlest transition-shadow shadow-xs"
            >
              
              {/* Top meta tags */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100 text-xs font-mono text-neutral-500">
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                  <div>
                    Order ID: <span className="font-bold text-neutral-950 bg-neutral-50 border border-neutral-200 px-2.5 py-0.5">ORD-{order.id}</span>
                  </div>
                  <div>•</div>
                  <div className="flex gap-1 items-center">
                    <Clock size={12} />
                    <span>Placing date: {dayjs(order.orderDate).format("MMM DD, YYYY - HH:mm")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="font-bold text-sm text-neutral-950 font-sans">
                    Total: ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="flex flex-col gap-4">
                {order.items && order.items.map((item, idx) => (
                  <div key={item.id || idx} className="flex gap-4 items-start text-xs text-neutral-600">
                    {item.imageUrl && (
                      <div className="w-12 aspect-4/5 overflow-hidden bg-neutral-50 flex-shrink-0 border border-neutral-150">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="flex-grow">
                      <span className="font-bold text-neutral-950 block">{item.name}</span>
                      <span className="font-mono text-neutral-400 text-[10px]">Qty: {item.quantity} × Size: M</span>
                    </div>
                    <div className="text-right font-bold text-neutral-950 font-mono">
                      ${((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery specifications */}
              <div className="bg-neutral-50/50 p-4 border border-neutral-100 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-sans text-neutral-500">
                <div className="flex items-center gap-1.5 leading-normal">
                  <MapPin size={13} className="text-neutral-700 flex-shrink-0" />
                  <span>Shipping Address: <strong className="text-neutral-700 font-sans">{order.shippingAddress || "N/A"}</strong></span>
                </div>
                {order.notes && (
                  <div className="text-neutral-400 italic">
                    Note: "{order.notes}"
                  </div>
                )}
              </div>

            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-100 pt-6 mt-4 gap-4">
              <span className="text-xs font-mono text-neutral-400">
                Trang lịch sử <strong className="text-neutral-900 font-bold">{currentPage}</strong> / <strong className="text-neutral-900 font-bold">{totalPages}</strong> (Tổng cộng {totalOrders} đơn hàng)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                    currentPage === 1
                      ? "bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  // Handle hiding too many page numbers if totalPages > 5
                  if (totalPages > 5 && Math.abs(currentPage - pageNumber) > 1 && pageNumber !== 1 && pageNumber !== totalPages) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) {
                      return <span key={`dots-${pageNumber}`} className="text-neutral-300 font-mono px-1">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-9 h-9 border text-xs font-mono font-bold transition-all duration-300 ${
                        currentPage === pageNumber
                          ? "bg-neutral-900 border-neutral-900 text-white"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 border text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 ${
                    currentPage === totalPages
                      ? "bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
