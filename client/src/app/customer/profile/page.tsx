"use client";

import { useAuth } from "@/components/providers/AuthProvider";

export default function CustomerProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Profile Settings</h1>
      
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
              {user.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900">
              {user.email}
            </div>
            <p className="mt-2 text-xs text-gray-500">Email addresses are currently locked to your account.</p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        To request account deletion or data exports, please contact support.
      </div>
    </div>
  );
}
