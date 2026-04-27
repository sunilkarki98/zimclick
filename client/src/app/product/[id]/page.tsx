"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/services/productService";
import type { Product } from "@/types";
import { useDispatch } from "react-redux";
import { addOptimisticItem, openCart } from "@/store/cartSlice";
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      productService.getProductById(id as string)
        .then(setProduct)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addOptimisticItem({
      id: Math.random().toString(), // temporary
      cartId: 'local',
      productId: product.id,
      quantity,
      selectedAttributes: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: product
    }));
    dispatch(openCart());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/" className="px-6 py-3 bg-brand text-white rounded-full font-bold hover:bg-brand-dark transition">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 pl-2">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Catalog
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Section */}
            <div className="bg-gray-100/50 p-6 sm:p-12 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 relative min-h-[350px] sm:min-h-[500px]">
              {product.images?.[0] ? (
                 <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="text-gray-300 flex flex-col items-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center shadow-inner mb-6">
                    <span className="text-6xl text-gray-400 font-bold">{product.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm tracking-widest uppercase font-bold text-gray-400 border border-gray-300 px-4 py-1 rounded-full">Preview Unavailable</span>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 sm:p-10 md:p-14 flex flex-col">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border bg-brand-50 text-brand-dark border-brand-light">
                  {product.brand}
                </span>
                {product.stock > 0 ? (
                  <span className="px-3 py-1 bg-brand-50 text-brand-dark text-xs font-bold tracking-wider uppercase rounded-full border border-brand-light flex items-center">
                    <div className="w-1.5 h-1.5 bg-brand rounded-full mr-1.5 animate-pulse"></div>
                    In Stock
                  </span>
                ) : (
                   <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold tracking-wider uppercase rounded-full border border-red-100">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center text-gray-600 font-medium">
                  Sold by &nbsp;
                  <Link href={`/store/${product.vendorId}`} className="hover:underline underline-offset-4 flex items-center gap-1 font-bold text-brand">
                    {product.vendor?.storeName || 'Unknown Store'}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-8">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                <span className="text-sm font-medium text-gray-500 ml-2">New Product</span>
              </div>

              <div className="text-4xl font-extrabold text-brand mb-8 flex items-baseline">
                ${product.price.toFixed(2)}
                <span className="text-lg text-gray-400 font-medium ml-2 uppercase tracking-wide">USD</span>
              </div>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light mb-10">
                {product.description || "Premium athletic gear engineered for maximum performance and durability."}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-10 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <div className="bg-white p-2 rounded-full shadow-sm"><ShieldCheck className="w-5 h-5 text-brand" /></div>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <div className="bg-white p-2 rounded-full shadow-sm"><Truck className="w-5 h-5 text-pop" /></div>
                  Fast Global Shipping
                </div>
              </div>

              {/* Add to Cart Flow */}
              <div className="mt-auto space-y-4">
                
                <div className="flex items-center gap-4 mb-2">
                   <div className="flex items-center border-2 border-gray-200 rounded-full">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-500 font-bold text-xl rounded-l-full transition" aria-label="Decrease quantity">-</button>
                     <div className="w-12 text-center font-bold text-gray-900">{quantity}</div>
                     <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-500 font-bold text-xl rounded-r-full transition" aria-label="Increase quantity">+</button>
                   </div>
                   <span className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Quantity</span>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full h-14 sm:h-16 bg-black text-white font-bold text-lg rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add {quantity > 1 ? quantity : ''} to Cart — ${(product.price * quantity).toFixed(2)}
                </button>
                <Link
                  href="/cart"
                  onClick={handleAddToCart}
                  className="w-full h-14 sm:h-16 bg-pop text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  Buy Now — ${(product.price * quantity).toFixed(2)}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
