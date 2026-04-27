import type { Product as PrismaProduct } from "../generated/client";

export type Product = PrismaProduct;

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
  vendorId: string;
}
