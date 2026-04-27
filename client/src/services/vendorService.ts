import { api } from "./api";
import type { Vendor, Product, SubOrder } from "../types";

export interface CreateVendorInput {
  storeName: string;
  description?: string;
  logo?: string;
}

export interface UpdateVendorInput {
  storeName?: string;
  description?: string;
  logo?: string;
}

export const vendorService = {
  /**
   * Register the currently logged-in user as a vendor.
   */
  register: (data: CreateVendorInput) => {
    return api.post<Vendor>("/vendor/register", data);
  },

  /**
   * Get the logged-in vendor's profile and latest products.
   */
  getProfile: () => {
    return api.get<Vendor>("/vendor/me");
  },

  /**
   * Update the logged-in vendor's profile.
   */
  updateProfile: (data: UpdateVendorInput) => {
    return api.put<Vendor>("/vendor/me", data);
  },

  /**
   * Get all active vendors (Public endpoint).
   */
  getAllVendors: () => {
    return api.get<Vendor[]>("/vendor");
  },

  /**
   * Get a specific vendor's profile by ID (Public endpoint).
   */
  getVendorById: (vendorId: string) => {
    return api.get<Vendor>(`/vendor/${vendorId}`);
  },

  /**
   * Get all sub-orders assigned to the logged-in vendor.
   */
  getVendorOrders: () => {
    return api.get<SubOrder[]>("/vendor/orders");
  },

  /**
   * Update the fulfillment status of a sub-order.
   */
  updateOrderStatus: (subOrderId: string, status: SubOrder["status"]) => {
    return api.patch<SubOrder>(`/vendor/orders/${subOrderId}/status`, { status });
  },
};
