import { api } from "./api";
import type { User, Vendor, Product } from "../types";

export const adminService = {
  // --- USERS ---
  async getAllUsers(): Promise<User[]> {
    return api.get("/admin/users");
  },

  async updateUserRole(userId: string, role: "customer" | "vendor" | "admin"): Promise<User> {
    return api.put(`/admin/users/${userId}/role`, { role });
  },

  // --- VENDORS ---
  async getAllVendors(): Promise<Vendor[]> {
    return api.get("/admin/vendors");
  },

  async toggleVendorStatus(vendorId: string, isActive: boolean): Promise<Vendor> {
    return api.put(`/admin/vendors/${vendorId}/status`, { isActive });
  },

  // --- PRODUCTS ---
  // Note: we can visually reuse productService.getAllProducts() for reading all products,
  // but we use this admin specific delete for destruction.
  async deleteProduct(productId: string): Promise<{ message: string }> {
    return api.delete(`/admin/products/${productId}`);
  }
};
