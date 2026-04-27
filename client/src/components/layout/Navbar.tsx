"use client";

import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

// Memoized selector — only recalculates when cart.items actually changes
const selectTotalQuantity = createSelector(
  (state: RootState) => state.cart.items,
  (items) => items.reduce((acc, item) => acc + item.quantity, 0)
);

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const totalQuantity = useSelector(selectTotalQuantity);
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Throttled scroll listener using requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);


  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 py-3" : "bg-white py-5"}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-xl p-1.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-gray-100">
              <Image 
                src="/logo/gymclick_logo.png" 
                alt="Gymclick Logo" 
                width={32} 
                height={32} 
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-brand-dark group-hover:text-pop transition-colors">
              Gymclick
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#products" className="text-base font-semibold text-brand-dark hover:text-pop transition">Explore</a>
            <a href="/#categories" className="text-base font-semibold text-brand-dark hover:text-pop transition">Categories</a>
            {user && (
              <Link href="/customer/orders" className="text-base font-semibold text-brand-dark hover:text-pop transition">My Dashboard</Link>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Cart */}
            <Link href="/cart" className="relative cursor-pointer group p-2" aria-label={`Shopping cart${totalQuantity > 0 ? `, ${totalQuantity} items` : ''}`}>
              <svg className="w-6 h-6 text-brand-dark group-hover:text-pop transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pop rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* Auth State */}
            {loading ? (
              <div className="h-9 w-9 bg-gray-100 rounded-full animate-pulse border border-gray-200"></div>
            ) : user ? (
              <div className="relative group cursor-pointer flex items-center gap-2">
                <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 hover:bg-gray-200 transition border border-gray-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm text-gray-900 font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {user.role === 'admin' && <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-brand-dark hover:bg-gray-50">Admin Portal</Link>}
                    {user.role === 'vendor' && <Link href="/vendor/dashboard" className="block px-4 py-2 text-sm text-brand-dark hover:bg-gray-50">Vendor Dashboard</Link>}
                    <Link href="/customer/orders" className="block px-4 py-2 text-sm text-brand-dark hover:bg-gray-50">Order History</Link>
                  </div>
                  <div className="py-1 border-t border-gray-50">
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">Log out</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-brand-dark hover:text-pop hidden sm:block transition">Log in</Link>
                <Link href="/login?mode=register" className="text-sm font-medium text-white bg-brand px-5 py-2 rounded-full hover:opacity-90 transition shadow-sm hover:shadow">Sign up</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-brand-dark hover:text-pop transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              <a href="/#products" className="block px-4 py-3 text-base font-semibold text-brand-dark hover:bg-brand-50 hover:text-pop rounded-xl transition">Explore</a>
              <a href="/#categories" className="block px-4 py-3 text-base font-semibold text-brand-dark hover:bg-brand-50 hover:text-pop rounded-xl transition">Categories</a>
              {user && (
                <Link href="/customer/orders" className="block px-4 py-3 text-base font-semibold text-brand-dark hover:bg-brand-50 hover:text-pop rounded-xl transition">My Dashboard</Link>
              )}
              {!loading && !user && (
                <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
                  <Link href="/login" className="block px-4 py-3 text-base font-semibold text-brand-dark hover:bg-brand-50 rounded-xl transition text-center">Log in</Link>
                  <Link href="/login?mode=register" className="block px-4 py-3 text-base font-bold text-white bg-brand rounded-xl text-center hover:opacity-90 transition">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
