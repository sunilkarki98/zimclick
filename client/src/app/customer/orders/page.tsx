"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(setOrders)
      .catch((err: any) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500 animate-pulse">Loading your order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500">When you purchase items from the marketplace, they will securely appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
        <p className="mt-2 text-gray-500">Check the status of recent orders, manage returns, and discover similar products.</p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border text-left rounded-2xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Order Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Placed</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-medium text-gray-900 truncate">...{order.id.slice(-8)}</p>
                </div>
              </div>
            </div>

            {/* Sub-orders (Shipments by Vendor) */}
            <div className="divide-y divide-gray-200">
              {order.subOrders?.map((subOrder) => (
                <div key={subOrder.id} className="p-6">
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                        ${subOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : subOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
                      `}>
                        {subOrder.status}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        Shipment from <span className="text-gray-900 font-bold">{subOrder.vendor?.storeName || 'Unknown Vendor'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Items in this shipment */}
                  <ul className="divide-y divide-gray-100">
                    {subOrder.items?.map((item) => (
                      <li key={item.id} className="py-4 flex gap-6">
                        <div className="h-24 w-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-center" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <h4 className="text-base font-bold text-gray-900">{item.product?.name || 'Deleted Product'}</h4>
                            <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                          </div>
                          
                          {/* Configured Attributes */}
                          {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {Object.entries(item.selectedAttributes).map(([key, val]) => (
                                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                                  {key}: {String(val)}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <p className="mt-auto text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
