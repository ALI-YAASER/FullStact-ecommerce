import React, { useEffect, useState } from 'react';
import { assets } from "../assets/assets.js";
import axios from "axios";
import { backendUrl } from "../App.jsx";
import { toast } from "react-toastify";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!token) {
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + '/api/orders/list',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse()); // عرض الأحدث أولاً
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/orders/status',
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("تم تحديث الحالة");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    try {
      const response = await axios.delete(
        `${backendUrl}/api/orders/delete/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("تم حذف الطلب بنجاح");
        await fetchAllOrders();
      }
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 font-medium text-gray-500">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-r-4 border-indigo-600 pr-4">لوحة إدارة الطلبات</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
            <p className="text-gray-400">لا توجد طلبات حالياً</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const isNewOrder = (new Date() - new Date(order.date)) / (1000 * 60 * 60) <= 24;

            return (
              <div key={index} className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                
                {/* Header: Order ID & Badge */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <img src={assets.parcel_icon} alt="" className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium tracking-wider">ID: #{order._id.slice(-8)}</p>
                        <h3 className="text-sm font-bold text-gray-800">{new Date(order.date).toLocaleDateString('ar-EG', {month:'long', day:'numeric', year:'numeric'})}</h3>
                    </div>
                    {isNewOrder && <span className="bg-red-100 text-red-600 text-[16px] px-2 py-0.5 rounded-full font-bold animate-pulse">جديد</span>}
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <span className="text-lg font-black text-indigo-700">ج.م {order.amount}</span>
                     <select
                        value={order.status}
                        onChange={(e) => statusHandler(e, order._id)}
                        className="bg-white border border-gray-300 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none font-semibold cursor-pointer"
                      >
                        <option value="Order Placed">تم الطلب</option>
                        <option value="Packing">جاري التعبئة</option>
                        <option value="Shipped">تم الشحن</option>
                        <option value="Out for delivery">خارج للتسليم</option>
                        <option value="Delivered">تم التسليم</option>
                      </select>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Column 1: Customer & Shipping */}
                  <div className="space-y-4">
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">العميل</h4>
                        <p className="font-bold text-gray-800">{order.name || 'مجهول'}</p>
                        <p className="text-sm text-gray-600">{order.customerDetails?.phone}</p>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">العنوان</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {order.address?.city}، {order.address?.state}<br/>
                            {order.address?.street}
                        </p>
                    </div>
                  </div>

                  {/* Column 2: Items */}
                  <div className="md:col-span-2">
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">المنتجات ({order.items.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                                <img  src={item.images}
                        alt={item.name}  className="w-12 h-12 rounded-lg object-cover bg-white" alt="" />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                                    <p className="text-sm font-bold text-gray-800 truncate">{item.size}</p>
                                    <p className="text-xs text-gray-500">{item.quantity}قطعة - {item.price} ج.م</p>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Notes & Delete */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">ملاحظات:</span>
                        <p className="text-sm text-gray-600 italic">{order.notes || 'لا توجد ملاحظات'}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="text-left sm:text-right flex-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">حالة الدفع</p>
                            <span className={`text-xs font-bold ${order.payment ? 'text-green-600' : 'text-amber-600'}`}>
                                {order.payment ? '● تم الدفع بنجاح' : '● الدفع عند الاستلام'}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteOrder(order._id)}
                            className="p-2.5 bg-white text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                            title="حذف الطلب"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;