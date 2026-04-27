"use client";

import { toast } from "sonner";
import {
  useGetVendorOrdersQuery,
  useUpdateOrderStatusMutation
} from "@/store/apiSlice";
import type { SubOrder } from "@/types";

export default function VendorOrdersPage() {
  const { data: orders = [], isLoading: loading } = useGetVendorOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (subOrderId: string, newStatus: SubOrder["status"]) => {
    try {
      await updateStatus({ subOrderId, status: newStatus }).unwrap();
      toast.success("Order status updated");
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data || "Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Incoming Orders</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-sm md:text-base">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Order Details</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Total</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Status</th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider text-xs">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((subOrder) => (
              <tr key={subOrder.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 border-b pb-2 mb-2">Order #{subOrder.id.slice(0, 8)}</div>
                  <ul className="text-gray-500 text-sm space-y-1">
                    {subOrder.items?.map(item => (
                      <li key={item.id} className="flex justify-between w-48">
                        <span className="truncate pr-2">{item.product?.name || "Product"}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-gray-400 mt-2">Placed: {new Date(subOrder.createdAt).toLocaleDateString()}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* The backend currently returns user in order.user, but our SubOrder type might need it */}
                  <div className="text-gray-900">{(subOrder as any).order?.user?.name || "Customer"}</div>
                  <div className="text-gray-500 text-sm">{(subOrder as any).order?.user?.email}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  ${subOrder.subtotal.toFixed(2)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(subOrder.status)}`}>
                    {subOrder.status}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <select
                    disabled={isUpdating}
                    className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 focus:ring-black focus:border-black"
                    value={subOrder.status}
                    onChange={(e) => handleStatusChange(subOrder.id, e.target.value as SubOrder["status"])}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No incoming orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
