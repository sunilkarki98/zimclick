"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X } from "lucide-react";
import Image from "next/image";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  theme: "dark" | "light";
  navItems: NavItem[];
  userInitial: string;
  userName: string;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  theme,
  navItems,
  userInitial,
  userName,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const isDark = theme === "dark";

  // Dynamic theme classes
  const asideClasses = isDark 
    ? "bg-black text-white" 
    : "bg-white border-r border-gray-200";
  
  const mobileAsideClasses = isDark 
    ? "bg-black text-white" 
    : "bg-white text-gray-900";

  const linkBaseClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm";
  const linkActiveClasses = isDark 
    ? "bg-white/10 text-white" 
    : "bg-brand-50 text-brand-dark border-r-4 border-brand";
  const linkInactiveClasses = isDark 
    ? "text-gray-400 hover:bg-white/5 hover:text-white" 
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const logoBgClasses = isDark ? "bg-white" : "bg-white border border-gray-100 shadow-sm";
  const titleClasses = `text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`;
  
  const backBtnClasses = `flex items-center gap-3 px-4 py-3 transition rounded-lg text-sm font-medium ${
    isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
  }`;

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        // use strict equality for admin (e.g. /admin/dashboard), but vendor sometimes uses startsWith if sub-routes exist
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${linkBaseClasses} ${isActive ? linkActiveClasses : linkInactiveClasses}`}
          >
            {item.icon}
            {item.name}
          </Link>
        );
      })}
    </>
  );

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className={isMobile ? "flex items-center justify-between mb-6" : "p-6 mb-2"}>
        <Link href={navItems[0]?.href || "/"} className="flex items-center gap-3 group">
          <div className={`rounded-lg p-1.5 flex items-center justify-center ${logoBgClasses}`}>
            <Image src="/logo/zimclick_logo.png" alt="Zimclick Logo" width={isMobile ? 24 : 28} height={isMobile ? 24 : 28} className="object-contain" style={{ width: 'auto', height: 'auto' }} />
          </div>
          <h2 className={titleClasses}>{title}</h2>
        </Link>
        {isMobile && (
          <button onClick={() => setMobileNavOpen(false)} className={`p-1 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      {!isMobile && <p className={`text-sm mt-0 ml-11 mb-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>{subtitle}</p>}
      
      <nav className={`flex-1 space-y-1 ${!isMobile ? "px-3" : ""}`}>
        <NavLinks />
      </nav>
      
      <div className={`pt-4 mt-auto border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
        <Link href="/" className={backBtnClasses}>
          <Home className="w-5 h-5" /> Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={`w-64 hidden md:flex flex-col ${asideClasses}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <aside className={`absolute left-0 top-0 bottom-0 w-72 p-6 flex flex-col shadow-2xl ${mobileAsideClasses}`}>
            <SidebarContent isMobile={true} />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 hidden sm:block">
              {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.name || title}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-black text-white' : 'bg-brand-50 text-brand-dark border border-brand-light'}`}>
              {userInitial}
            </div>
            <span className="text-sm font-medium hidden sm:block text-gray-700">{userName}</span>
          </div>
        </header>
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
