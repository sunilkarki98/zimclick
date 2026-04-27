"use client";

import { toast } from "sonner";
import { useState } from "react";
import {
  useGetProductsQuery,
  useAdminDeleteProductMutation
} from "@/store/apiSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function AdminProductsPage() {
  const { data: products = [], isLoading: loading } = useGetProductsQuery();
  const [adminDelete, { isLoading: isDeleting }] = useAdminDeleteProductMutation();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDelete(deleteId).unwrap();
      toast.success("Product deleted globally");
    } catch (err: any) {
      toast.error("Failed to delete product: " + (err?.data?.error || err?.data || err.message));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Global Product Override</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-500">${p.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {p.vendor?.storeName || 'Unknown Vendor'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setDeleteId(p.id)} className="text-red-600 hover:text-red-900 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Admin Override: Delete Product"
        description="Are you sure you want to globally delete this product? This action is irreversible and will remove it from the entire marketplace."
        confirmText="Delete Product"
      />
    </div>
  );
}
