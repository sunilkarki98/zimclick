"use client";

import { useEffect, useState } from "react";
import { vendorService } from "@/services/vendorService";
import type { Vendor } from "@/types";

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorService.getProfile()
      .then(setVendor)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="mt-2 text-3xl font-semibold">{vendor?.products?.length || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Store Status</h3>
          <p className="mt-2 text-3xl font-semibold">
            {vendor?.isActive ? (
              <span className="text-green-600 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Active
              </span>
            ) : "Inactive"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Profile Name</h3>
          <p className="mt-2 text-xl font-semibold truncate">{vendor?.storeName}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium">Recent Products</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {vendor?.products?.slice(0, 5).map((p) => (
            <li key={p.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-semibold text-gray-900">{p.name}</p>
                <p className="text-sm text-gray-500">{p.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${p.price.toFixed(2)}</p>
                <p className={`text-sm ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {p.stock} in stock
                </p>
              </div>
            </li>
          ))}
          {(!vendor?.products || vendor.products.length === 0) && (
            <li className="p-8 text-center text-gray-500">No products listed yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
