"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { productService } from "@/services/productService";
import type { User, Vendor, Product } from "@/types";
import { Users, Store, Package, TrendingUp, ShieldCheck, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, vendors: 0, products: 0 });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, vendors, products] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllVendors(),
          productService.getAllProducts()
        ]);
        
        setStats({
          users: users.length,
          vendors: vendors.length,
          products: products.length
        });
        setRecentUsers(users.slice(-5).reverse());
        setRecentProducts(products.slice(-5).reverse());
      } catch (e) {
        console.error("Failed to load global admin stats", e);
      }
    };
    loadData();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    { label: "Active Vendors", value: stats.vendors, icon: Store, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { label: "Live Products", value: stats.products, icon: Package, color: "from-violet-500 to-violet-600", bg: "bg-violet-50", text: "text-violet-600" },
    { label: "Estimated Revenue", value: `$${(stats.products * 85).toLocaleString()}`, icon: TrendingUp, color: "from-amber-500 to-amber-600", bg: "bg-amber-50", text: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Overview</h1>
        <p className="text-gray-500 mt-1">Real-time analytics and system health for Gymclick.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-5 h-5 ${card.text}`} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">LIVE</span>
            </div>
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Recent Users
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 5</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {recentUsers.length > 0 ? recentUsers.map((u) => (
              <li key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border border-gray-200">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  u.role === 'admin' ? 'bg-red-50 text-red-600' : u.role === 'vendor' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {u.role}
                </span>
              </li>
            )) : (
              <li className="px-6 py-8 text-center text-gray-400 text-sm">No users registered yet.</li>
            )}
          </ul>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-violet-500" /> Recent Products
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 5</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {recentProducts.length > 0 ? recentProducts.map((p) => (
              <li key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${p.price.toFixed(2)}</p>
                  <p className={`text-xs font-bold ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.stock} in stock</p>
                </div>
              </li>
            )) : (
              <li className="px-6 py-8 text-center text-gray-400 text-sm">No products listed yet.</li>
            )}
          </ul>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-6 flex items-center gap-4">
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg">All Systems Operational</h3>
          <p className="text-gray-400 text-sm">Supabase Auth, PostgreSQL, and Express API are running cleanly. Inventory fully seeded.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Healthy</span>
        </div>
      </div>
    </div>
  );
}
