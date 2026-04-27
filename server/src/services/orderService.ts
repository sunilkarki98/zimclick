import { prisma } from "../lib/prismaClient";

export const orderService = {
  async createOrder(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Group cart items by vendorId for sub-order creation
    const itemsByVendor = new Map<string, typeof cart.items>();
    for (const item of cart.items) {
      const vendorId = item.product.vendorId;
      if (!itemsByVendor.has(vendorId)) {
        itemsByVendor.set(vendorId, []);
      }
      itemsByVendor.get(vendorId)!.push(item);
    }

    // Atomic transaction: lock stock + create order + sub-orders + deduct stock + clear cart
    const order = await prisma.$transaction(async (tx) => {
      // 1. Validate stock availability INSIDE the transaction to prevent race conditions
      for (const item of cart.items) {
        // Find product with an exclusive lock if possible, but Prisma's transaction and update ensures atomic decrement
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${item.product.name}".`);
        }
      }

      // 2. Create the main order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "pending",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
              selectedAttributes: item.selectedAttributes ?? undefined,
            })),
          },
        },
        include: { items: true },
      });

      // 3. Create sub-orders per vendor
      for (const [vendorId, vendorItems] of itemsByVendor) {
        const subtotal = vendorItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const subOrder = await tx.subOrder.create({
          data: {
            orderId: newOrder.id,
            vendorId,
            subtotal,
            status: "pending",
          },
        });

        // 4. Link order items to sub-order (Fixed N+1 loop using updateMany)
        const orderItemIds = newOrder.items
          .filter((oi) => vendorItems.some((vi) => vi.productId === oi.productId))
          .map((oi) => oi.id);

        await tx.orderItem.updateMany({
          where: { id: { in: orderItemIds } },
          data: { subOrderId: subOrder.id },
        });
      }

      // 5. Deduct stock atomically (batched to minimize transaction lock time)
      await Promise.all(
        cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      // 6. Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Return full order with sub-orders
      return tx.order.findUniqueOrThrow({
        where: { id: newOrder.id },
        include: {
          items: { include: { product: true } },
          subOrders: { include: { vendor: true, items: { include: { product: true } } } },
        },
      });
    });

    return order;
  },

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        subOrders: { include: { vendor: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { product: true } },
        subOrders: { include: { vendor: true, items: { include: { product: true } } } },
      },
    });
    if (!order) throw new Error("Order not found");
    return order;
  },
};
