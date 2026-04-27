import { api } from "./api";
import type { Product } from "../types";

export interface CreateProductInput {
  name: string;
  price: number;
  brand: string;
  stock: number;
  description?: string;
  images?: string[];
  attributes?: Record<string, any>;
  weight?: number;
  categoryIds?: string[];
  tagIds?: string[];
}

export const productService = {
  /**
   * Get all products (Public endpoint).
   */
  getAllProducts: () => {
    return api.get<Product[]>("/products");
  },

  /**
   * Get a single product by ID (Public endpoint).
   */
  getProductById: (productId: string) => {
    return api.get<Product>(`/products/${productId}`);
  },

  /**
   * Get all products owned by a specific vendor (Public endpoint).
   */
  getProductsByVendor: (vendorId: string) => {
    return api.get<Product[]>(`/vendor/${vendorId}/products`);
  },

  /**
   * Get all products owned by the currently logged-in vendor.
   */
  getMyProducts: () => {
    return api.get<Product[]>("/vendor/me/products");
  },

  /**
   * Create a new product under the logged-in vendor's storefront.
   */
  createProduct: (data: CreateProductInput) => {
    return api.post<Product>("/products", data);
  },

  /**
   * Update an existing product. 
   * Backend enforces ownership (vendors can only edit their own products).
   */
  updateProduct: (productId: string, data: Partial<CreateProductInput>) => {
    return api.put<Product>(`/products/${productId}`, data);
  },

  /**
   * Delete a product. 
   * Backend enforces ownership.
   */
  deleteProduct: (productId: string) => {
    return api.delete<{ message: string }>(`/products/${productId}`);
  },
};
