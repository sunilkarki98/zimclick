"use client";

import { useEffect, useState } from "react";
import { vendorService } from "@/services/vendorService";
import type { Vendor } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "@/components/features/ProductCard";

export default function VendorStorefrontPage() {
  const params = useParams();
  const vendorId = params.id as string;
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorId) {
      vendorService.getVendorById(vendorId)
        .then(setVendor)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Store Not Found</h2>
        <p className="text-gray-500 mt-2">This vendor may have been removed or deactivated.</p>
        <Link href="/" className="mt-6 inline-block text-brand font-medium underline">Return to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Store Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="h-32 bg-gray-900"></div> {/* Banner placeholder */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 gap-6">
          <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white overflow-hidden flex-shrink-0 shadow-md">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.storeName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-300">
                {vendor.storeName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left pt-2 sm:pt-0">
            <h1 className="text-3xl font-bold text-gray-900">{vendor.storeName}</h1>
            <p className="text-gray-500 mt-1 max-w-2xl">{vendor.description || "Welcome to our store! Check out our latest products."}</p>
          </div>
        </div>
      </div>

      {/* Store Products */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">All Products</h2>
        
        {vendor.products && vendor.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {vendor.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No products available</h3>
            <p className="mt-1 text-gray-500">This vendor hasn&apos;t listed any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
