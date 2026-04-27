import { api } from "./api";
import type { Cart } from "../types";

export interface AddCartItemInput {
  productId: string;
  quantity: number;
}

export const cartService = {
  /**
   * Get the current user's cart.
   */
  getCart: () => {
    return api.get<Cart>("/cart");
  },

  /**
   * Add an item to the cart. 
   * If the item already exists, its quantity is increased.
   */
  addItem: (data: AddCartItemInput) => {
    return api.post<Cart>("/cart/items", data);
  },

  /**
   * Update the quantity of a specific cart item.
   */
  updateItemQuantity: (cartItemId: string, quantity: number) => {
    return api.patch<Cart>(`/cart/items/${cartItemId}`, { quantity });
  },

  /**
   * Remove a specific item from the cart.
   */
  removeItem: (cartItemId: string) => {
    return api.delete<Cart>(`/cart/items/${cartItemId}`);
  },

  /**
   * Completely clear the current user's cart.
   */
  clearCart: () => {
    return api.delete<{ message: string }>("/cart");
  },
};
