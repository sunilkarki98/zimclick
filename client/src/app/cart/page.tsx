"use client";

import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeOptimisticItem, updateOptimisticQuantity, clearCart } from "@/store/cartSlice";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-28 px-4 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-brand" />
        </div>
        <h1 className="text-3xl font-extrabold mb-3 text-gray-900">Your Cart is Empty</h1>
        <p className="mb-8 text-gray-500">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="text-white bg-brand px-8 py-3 rounded-full font-bold hover:opacity-90 transition shadow-md inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-gray-400 hover:text-gray-600 transition" aria-label="Back to store">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <span className="text-sm font-bold text-gray-400">({items.length} items)</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Image */}
              <div className="relative h-40 sm:h-28 w-full sm:w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                {item.product?.images?.[0] ? (
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="(max-width: 640px) 100vw, 112px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">No Image</div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.product?.name || 'Product'}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.product?.brand}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-200 rounded-full">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) dispatch(removeOptimisticItem(item.id));
                        else dispatch(updateOptimisticQuantity({ id: item.id, quantity: item.quantity - 1 }));
                      }}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateOptimisticQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-extrabold text-gray-900">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => dispatch(removeOptimisticItem(item.id))}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      aria-label={`Remove ${item.product?.name || 'item'} from cart`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => dispatch(clearCart())} className="text-sm font-medium text-red-500 hover:text-red-700 transition mt-2">
            Clear entire cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 h-fit bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="font-bold text-brand">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-extrabold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="w-full mt-6 py-4 bg-brand text-white font-bold text-base rounded-2xl hover:opacity-90 transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Proceed to Checkout
          </button>
          <Link href="/" className="block text-center mt-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
