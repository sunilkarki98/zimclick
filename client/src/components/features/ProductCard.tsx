"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { Store, ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addOptimisticItem, openCart } from "@/store/cartSlice";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addOptimisticItem({
      id: "temp-" + Date.now(),
      cartId: "temp",
      productId: product.id,
      quantity: 1,
      selectedAttributes: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: product
    }));
    dispatch(openCart());
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addOptimisticItem({
      id: "temp-" + Date.now(),
      cartId: "temp",
      productId: product.id,
      quantity: 1,
      selectedAttributes: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      product: product
    }));
  };

  return (
    <div className="group flex flex-col transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-200 block">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          {product.images && product.images.length > 0 ? (
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
          )}
        </Link>

        {/* Brand Badge */}
        {product.brand && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-black/5">
            {product.brand}
          </div>
        )}

        {/* Action Buttons — visible on hover (desktop) and always on mobile via focus/touch */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-10 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out flex gap-2 sm:opacity-0 max-sm:opacity-100 max-sm:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-white/90 backdrop-blur-md text-black font-bold py-2.5 px-3 rounded-xl shadow-lg border border-white/50 hover:bg-brand hover:border-brand hover:text-white transition-colors text-sm flex items-center justify-center gap-1.5"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
          <Link
            href="/cart"
            onClick={handleBuyNow}
            className="flex-1 bg-pop backdrop-blur-md text-white font-bold py-2.5 px-3 rounded-xl shadow-lg border border-white/20 hover:opacity-90 transition-colors text-sm text-center"
          >
            Buy Now
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 px-1">
        <h3 className="text-base font-bold text-brand-dark leading-tight mb-1.5">
          <Link href={`/product/${product.id}`} className="hover:underline decoration-2 underline-offset-4">
            {product.name}
          </Link>
        </h3>
        
        {product.vendor?.storeName && (
          <div className="mb-3">
            <Link href={`/store/${product.vendorId}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-50 text-brand-dark hover:bg-brand-light transition border border-brand-light/50">
              <Store className="w-3.5 h-3.5" />
              {product.vendor.storeName}
            </Link>
          </div>
        )}

        <div className="mt-auto flex justify-between items-center">
          <p className="text-xl font-black text-brand">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
