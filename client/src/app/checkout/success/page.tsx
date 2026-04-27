"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      orderService.getOrderById(orderId)
        .then(setOrder)
        .catch(err => setError("Could not find your order details."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("No order ID provided.");
    }
  }, [orderId]);

  if (loading) return <div className="p-20 text-center">Loading receipt...</div>;

  if (error || !order) {
    return (
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-6">{error || "Something went wrong."}</p>
        <Link href="/" className="text-brand font-medium underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 mb-4">
          <svg className="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Payment successful!</h1>
        <p className="mt-2 text-gray-500 text-lg">Your order #{order.id.slice(0, 8)} has been placed.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex justify-between">
            Receipt Breakdown
            <span>Total: ${order.total.toFixed(2)}</span>
          </h2>
        </div>

        {/* Display each vendor's SubOrder separately */}
        <div className="divide-y divide-gray-200">
          {order.subOrders?.map((subOrder) => (
            <div key={subOrder.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-semibold text-gray-900">
                  Fulfilled by: <span className="underline">{subOrder.vendor?.storeName || 'Unknown Vendor'}</span>
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-dark capitalize">
                  {subOrder.status}
                </span>
              </div>
              
              <ul className="space-y-4 text-sm text-gray-600">
                {subOrder.items?.map((item) => (
                  <li key={item.id} className="flex justify-between border-l-2 border-brand-light pl-4 py-1">
                    <span className="flex-1">{item.product?.name} x{item.quantity}</span>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
                <li className="flex justify-between font-bold text-gray-900 pl-4 pt-2">
                  <span>Vendor Subtotal</span>
                  <span>${subOrder.subtotal.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
