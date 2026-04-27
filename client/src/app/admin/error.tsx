"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-5">
          <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Panel Error</h2>
        <p className="text-sm text-gray-500 mb-6">{error.message || "An unexpected error occurred in the admin panel."}</p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
