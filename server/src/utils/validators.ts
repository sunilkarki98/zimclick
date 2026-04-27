import { z } from "zod";

// --- Auth Validations ---
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// --- Vendor Validations ---
export const createVendorSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().optional(),
  logo: z.string().url("Logo must be a valid URL").optional(),
});

export const updateVendorSchema = z.object({
  storeName: z.string().min(2).optional(),
  description: z.string().optional(),
  logo: z.string().url("Logo must be a valid URL").optional(),
});

// --- Product Validations ---
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  description: z.string().optional(),
  images: z.array(z.string().url("Must be a valid URL")).default([]),
  attributes: z.record(z.string(), z.any()).optional(),
  weight: z.number().positive().optional(),
  categoryIds: z.array(z.string().uuid()).default([]),
  tagIds: z.array(z.string().uuid()).default([]),
});

// --- Cart Validations ---
export const cartItemSchema = z.object({
  productId: z.string().uuid("Invalid Product ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  selectedAttributes: z.record(z.string(), z.any()).optional(),
});

// --- Sub-Order Status Validation ---
const VALID_SUB_ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type SubOrderStatusValue = (typeof VALID_SUB_ORDER_STATUSES)[number];

export const subOrderStatusSchema = z.enum(VALID_SUB_ORDER_STATUSES, {
  message: `Status must be one of: ${VALID_SUB_ORDER_STATUSES.join(", ")}`,
});
