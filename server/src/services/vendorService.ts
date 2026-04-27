import { prisma } from "../lib/prismaClient";
import { createVendorSchema, updateVendorSchema, subOrderStatusSchema } from "../utils/validators";
import type { CreateVendorInput } from "../types";
import { z } from "zod";
import { UserRole } from "../generated/client";

export const vendorService = {
  async register(userId: string, data: CreateVendorInput) {
    const parsed = createVendorSchema.parse(data);

    // Check if user already has a vendor profile
    const existing = await prisma.vendor.findUnique({ where: { userId } });
    if (existing) throw new Error("You already have a vendor profile");

    // Create vendor profile and update user role
    const vendor = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { role: UserRole.vendor },
      });

      return tx.vendor.create({
        data: {
          userId,
          storeName: parsed.storeName,
          description: parsed.description,
          logo: parsed.logo,
        },
      });
    });

    return vendor;
  },

  async getProfile(userId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: { products: true },
    });
    if (!vendor) throw new Error("Vendor profile not found");
    return vendor;
  },

  async getById(vendorId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { products: true },
    });
    if (!vendor) throw new Error("Vendor not found");
    return vendor;
  },

  async getAll() {
    return prisma.vendor.findMany({
      where: { isActive: true },
      include: { products: { take: 5 } },
    });
  },

  async updateProfile(
    userId: string,
    data: z.infer<typeof updateVendorSchema>
  ) {
    const parsed = updateVendorSchema.parse(data);

    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new Error("Vendor profile not found");

    return prisma.vendor.update({
      where: { id: vendor.id },
      data: parsed,
    });
  },

  async getVendorOrders(vendorId: string) {
    return prisma.subOrder.findMany({
      where: { vendorId },
      include: {
        items: { include: { product: true } },
        order: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateSubOrderStatus(
    userId: string,
    subOrderId: string,
    status: string
  ) {
    // Validate status against enum
    const validStatus = subOrderStatusSchema.parse(status);

    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) throw new Error("Vendor profile not found");

    const subOrder = await prisma.subOrder.findFirst({
      where: { id: subOrderId, vendorId: vendor.id },
    });
    if (!subOrder) throw new Error("Sub-order not found");

    return prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status: validStatus },
    });
  },
};
