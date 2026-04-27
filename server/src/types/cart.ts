import type { Cart as PrismaCart, CartItem as PrismaCartItem } from "../generated/client";

export type Cart = PrismaCart;

export type CartItem = PrismaCartItem;

export interface AddCartItemInput {
  productId: string;
  quantity: number;
  selectedAttributes?: Record<string, any>;
}
