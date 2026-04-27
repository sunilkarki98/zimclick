"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Cart error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto py-28 px-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart Error</h2>
      <p className="text-gray-500 mb-8">We couldn&apos;t load your cart. Please try again.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={reset} className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
          Try Again
        </button>
        <Link href="/" className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
