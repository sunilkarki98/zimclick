"use client";

import { toast } from "sonner";
import {
  useGetAdminVendorsQuery,
  useToggleVendorStatusMutation
} from "@/store/apiSlice";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useState } from "react";

export default function AdminVendorsPage() {
  const { data: vendors = [], isLoading: loading } = useGetAdminVendorsQuery();
  const [toggleStatus, { isLoading: isToggling }] = useToggleVendorStatusMutation();

  const [confirmAction, setConfirmAction] = useState<{ vendorId: string; currentStatus: boolean } | null>(null);

  const handleToggleStatus = async () => {
    if (!confirmAction) return;
    try {
      await toggleStatus({ vendorId: confirmAction.vendorId, isActive: !confirmAction.currentStatus }).unwrap();
      toast.success(`Storefront ${confirmAction.currentStatus ? 'suspended' : 'activated'}`);
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data || "Failed to update vendor status");
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Marketplace Vendors</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Storefront</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{vendor.storeName}</div>
                  <div className="text-sm text-gray-500">{vendor.description || 'No description provided.'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {vendor.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(vendor.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setConfirmAction({ vendorId: vendor.id, currentStatus: vendor.isActive })} 
                    className={`${vendor.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {vendor.isActive ? 'Suspend Store' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleToggleStatus}
        isLoading={isToggling}
        title={confirmAction?.currentStatus ? "Suspend Storefront" : "Reactivate Storefront"}
        description={confirmAction?.currentStatus 
          ? "Are you sure you want to suspend this storefront? The vendor will not be able to sell until reactivated."
          : "Are you sure you want to reactivate this storefront?"
        }
        confirmText={confirmAction?.currentStatus ? "Suspend" : "Reactivate"}
        isDestructive={confirmAction?.currentStatus ?? true}
      />
    </div>
  );
}
