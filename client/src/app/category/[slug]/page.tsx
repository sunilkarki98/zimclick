"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import Link from "next/link";
import { ArrowLeft, Filter } from "lucide-react";
import ProductCard from "@/components/features/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Format the slug back into a human readable title
  // e.g., 'sports-accessories' -> 'Sports Accessories'
  const categoryName = typeof slug === 'string' 
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Store';

  useEffect(() => {
    productService.getAllProducts()
      .then(allProducts => {
        // Find products that contain the specific category slug
        const filtered = allProducts.filter(p => {
          // Attempt to match if backend includes populated categories array
          if (p.categories && Array.isArray(p.categories)) {
             return p.categories.some((c: any) => c.slug === slug);
          }
          // Fallback just in case backend doesn't populate nested categories:
          // We can just regex the description or name as a safety net demo.
          return p.name.toLowerCase().includes(slug as string) || 
                 p.description?.toLowerCase().includes(slug as string) ||
                 categoryName.toLowerCase().includes(p.name.toLowerCase());
        });
        setProducts(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{categoryName} Gear</h1>
              <p className="text-gray-500 mt-2">Showing all premium {categoryName.toLowerCase()} equipment</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
            <div className="text-6xl mb-4">🏏</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No {categoryName} items found!</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">We are currently restocking our elite {categoryName.toLowerCase()} inventory. Check back soon.</p>
            <Link href="/" className="px-6 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand-dark transition">
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
