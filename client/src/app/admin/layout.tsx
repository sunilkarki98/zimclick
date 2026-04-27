"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Users, Store, Package } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Manage Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "Manage Vendors", href: "/admin/vendors", icon: <Store className="w-5 h-5" /> },
    { name: "Manage Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout
      title="Admin Portal"
      subtitle="System Oversight"
      theme="dark"
      navItems={navItems}
      userInitial="A"
      userName="Admin"
    >
      {children}
    </DashboardLayout>
  );
}
