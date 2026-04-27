import { prisma } from "../lib/prismaClient";
import { cartItemSchema } from "../utils/validators";
import type { AddCartItemInput } from "../types";
import { z } from "zod";

export const cartService = {
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
    return cart;
  },

  async addItem(userId: string, data: AddCartItemInput) {
    const parsed = cartItemSchema.parse(data);

    // Verify product exists and has sufficient stock
    const product = await prisma.product.findUnique({
      where: { id: parsed.productId },
    });
    if (!product) throw new Error("Product not found");
    if (product.stock < parsed.quantity) {
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    const cart = await this.getCart(userId);

    const existingItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id, productId: parsed.productId },
    });

    // Check if an existing item has the exact same attributes
    const existingItem = existingItems.find(item => 
      JSON.stringify(item.selectedAttributes || {}) === JSON.stringify(parsed.selectedAttributes || {})
    );

    if (existingItem) {
      const newQty = existingItem.quantity + parsed.quantity;
      if (newQty > product.stock) {
        throw new Error(`Cannot exceed available stock (${product.stock})`);
      }
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parsed.productId,
        quantity: parsed.quantity,
        selectedAttributes: parsed.selectedAttributes || {},
      },
      include: { product: true },
    });
  },

  async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
    if (quantity < 1) throw new Error("Quantity must be at least 1");

    const cart = await this.getCart(userId);
    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
      include: { product: true },
    });

    if (!item) throw new Error("Item not found in your cart");
    if (quantity > item.product.stock) {
      throw new Error(`Only ${item.product.stock} items available in stock`);
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });
  },

  async removeItem(userId: string, cartItemId: string) {
    const cart = await this.getCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: cartItemId, cartId: cart.id },
    });

    if (!item) throw new Error("Item not found in your cart");

    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  },

  async clearCart(userId: string) {
    const cart = await this.getCart(userId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return { message: "Cart cleared" };
  },
};
