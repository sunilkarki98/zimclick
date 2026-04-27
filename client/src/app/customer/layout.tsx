"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, User as UserIcon, Home, Menu, X } from "lucide-react";
import Image from "next/image";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  const navItems = [
    { label: "Order History", href: "/customer/orders", icon: <Package className="w-5 h-5" /> },
    { label: "Profile Settings", href: "/customer/profile", icon: <UserIcon className="w-5 h-5" /> },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 p-6 hidden md:flex flex-col shadow-lg">
        <div className="mb-8">
          <Link href="/customer/orders" className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
              <Image src="/logo/zimclick_logo.png" alt="Zimclick Logo" width={28} height={28} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">My Account</span>
          </Link>
          <p className="text-slate-400 text-sm mt-2">Customer Dashboard</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavLinks />
        </nav>

        <div className="pt-6 border-t border-slate-700/50 mt-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition rounded-xl hover:bg-white/5">
            <Home className="w-5 h-5" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 text-slate-100 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <Link href="/customer/orders" className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-1.5 flex items-center justify-center">
                  <Image src="/logo/zimclick_logo.png" alt="Zimclick Logo" width={24} height={24} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">My Account</span>
              </Link>
              <button onClick={() => setMobileNavOpen(false)} className="text-slate-400 hover:text-white p-1" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              <NavLinks />
            </nav>
            <div className="pt-6 border-t border-slate-700/50 mt-auto">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition rounded-xl hover:bg-white/5">
                <Home className="w-5 h-5" /> Back to Store
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">
              {navItems.find(n => n.href === pathname)?.label || "Customer Account"}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">{user.name}</span>
              <span className="text-xs text-slate-500 leading-tight">Customer</span>
            </div>
          </div>
        </header>
        
        <div className="p-4 sm:p-8 flex-1">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
