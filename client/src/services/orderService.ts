import { api } from "./api";
import type { Order } from "../types";

export interface CreateOrderResponse {
  order: Order;
  message?: string;
}

export const orderService = {
  /**
   * Get all orders placed by the current user.
   * Includes complete order details and SubOrders (vendor splits).
   */
  getMyOrders: () => {
    return api.get<Order[]>("/orders");
  },

  /**
   * Get a specific order by ID.
   * Verifies that the order belongs to the logged-in user.
   */
  getOrderById: (orderId: string) => {
    return api.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Checkout: Converts the current user's cart into an Order.
   * This automatically groups items by vendor into SubOrders,
   * deducts stock, and clears the cart on the backend.
   */
  checkout: () => {
    return api.post<CreateOrderResponse>("/orders");
  },
};
