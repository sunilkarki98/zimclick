"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();

  // Exclude Footer on dashboard routes where they have their own layout
  const isDashboard = pathname.startsWith('/vendor') || pathname.startsWith('/admin') || pathname.startsWith('/customer');

  if (isDashboard) return null;

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-brand">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-white rounded-lg p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                <Image 
                  src="/logo/zimclick_logo.png" 
                  alt="Zimclick Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-pop transition-colors">
                Zimclick
              </span>
            </Link>
            <p className="text-brand-light/70 text-sm leading-relaxed mb-6">
              The premier marketplace connecting elite independent vendors with discerning customers.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-brand-light">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/80 hover:text-pop transition text-sm">All Categories</Link></li>
              <li><Link href="/deals" className="text-white/80 hover:text-pop transition text-sm">Today&apos;s Deals</Link></li>
              <li><Link href="/new" className="text-white/80 hover:text-pop transition text-sm">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-brand-light">Sell</h3>
            <ul className="space-y-3">
              <li><Link href="/vendor/register" className="text-white/80 hover:text-pop transition text-sm">Open a Store</Link></li>
              <li><Link href="/vendor/fees" className="text-white/80 hover:text-pop transition text-sm">Pricing & Fees</Link></li>
              <li><Link href="/vendor/support" className="text-white/80 hover:text-pop transition text-sm">Seller Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-brand-light">Stay Updated</h3>
            <p className="text-white/80 text-sm mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm rounded-lg px-4 py-2 w-full focus:outline-none focus:border-pop transition" />
              <button className="bg-pop text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-pop-dark transition">Join</button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Zimclick, Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-white/60 hover:text-pop transition">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-white/60 hover:text-pop transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
