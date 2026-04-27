"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/services/api";
import { vendorService } from "@/services/vendorService";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Lock, Mail, User, Store, FileText, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function VendorRegisterPage() {
  const router = useRouter();
  const { user, isVendor, refreshUser } = useAuth();

  const [step, setStep] = useState(user ? 2 : 1); // Skip to step 2 if already logged in
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Account fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Store fields
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");

  // If already a vendor, go to dashboard
  if (isVendor) {
    router.push("/vendor/dashboard");
    return null;
  }

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post<any>("/auth/register", { name, email, password });
      if (res.error) throw new Error(res.error);

      if (res.session) {
        await supabase.auth.setSession({
          access_token: res.session.access_token,
          refresh_token: res.session.refresh_token,
        });
      }

      await refreshUser();
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Account creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await vendorService.register({
        storeName,
        description: description || undefined,
      });

      await refreshUser();
      router.push("/vendor/dashboard");
    } catch (err: any) {
      setError(err.message || "Store creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl">
            <Store className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
          {step === 1 ? "Create your Vendor Account" : "Set up your Store"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 ? "Step 1 of 2 — Account details" : "Step 2 of 2 — Store details"}
        </p>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
          <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-gray-100">

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm font-bold text-red-700">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleStep1}>
              <div>
                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black text-sm text-gray-900 font-medium bg-white"
                    placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Email address</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black text-sm text-gray-900 font-medium bg-white"
                    placeholder="vendor@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black text-sm text-gray-900 font-medium bg-white"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-900 transition-all hover:scale-[1.02] disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Continue <ArrowRight className="ml-2 w-4 h-4" /></>}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500">Sign in</Link>
              </p>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleStep2}>
              <div>
                <label className="block text-sm font-bold text-gray-700">Store Name <span className="text-red-500">*</span></label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black text-sm text-gray-900 font-medium bg-white"
                    placeholder="e.g. Acme Sports Gear" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Store Description</label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-black focus:border-black text-sm text-gray-900 font-medium bg-white resize-none"
                    placeholder="Tell customers what your store sells..." />
                </div>
              </div>

              <button type="submit" disabled={loading || !storeName}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-900 transition-all hover:scale-[1.02] disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Launch Store <ArrowRight className="ml-2 w-4 h-4" /></>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
