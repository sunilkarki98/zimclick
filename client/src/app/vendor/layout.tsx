"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, ShoppingCart, Settings } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { user, isVendor, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/vendor/register") {
        router.push("/vendor/register");
      } else if (user && !isVendor && pathname !== "/vendor/register") {
        router.push("/vendor/register");
      }
    }
  }, [user, isVendor, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (pathname === "/vendor/register") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Products", href: "/vendor/products", icon: <Package className="w-5 h-5" /> },
    { name: "Orders", href: "/vendor/orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Settings", href: "/vendor/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout
      title="Vendor Portal"
      subtitle="Store Management"
      theme="light"
      navItems={navItems}
      userInitial={user?.name?.charAt(0)?.toUpperCase() || 'V'}
      userName={user?.name || 'Vendor'}
    >
      {children}
    </DashboardLayout>
  );
}
