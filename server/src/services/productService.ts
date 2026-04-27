import { prisma } from "../lib/prismaClient";
import { productSchema } from "../utils/validators";
import type { Product, CreateProductInput } from "../types";

export const productService = {
  async getAll(limit = 50, offset = 0): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { vendor: { select: { storeName: true, id: true } } },
      take: limit,
      skip: offset,
    });
  },

  async getById(id: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { vendor: { select: { storeName: true, id: true } } },
    });
    if (!product) throw new Error("Product not found");
    return product;
  },

  async getByVendor(vendorId: string, limit = 50, offset = 0): Promise<Product[]> {
    return prisma.product.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  },

  async create(data: CreateProductInput): Promise<Product> {
    const { vendorId, categoryIds, tagIds, attributes, images, ...rest } = data;
    const parsed = productSchema.parse({ ...rest, categoryIds, tagIds, attributes, images });
    
    return prisma.product.create({
      data: { 
        ...rest,
        vendorId,
        attributes: attributes ?? {},
        images: images ?? [],
        categories: parsed.categoryIds?.length ? { connect: parsed.categoryIds.map((id) => ({ id })) } : undefined,
        tags: parsed.tagIds?.length ? { connect: parsed.tagIds.map((id) => ({ id })) } : undefined
      },
    });
  },

  async update(id: string, vendorId: string, data: Partial<CreateProductInput>): Promise<Product> {
    // Ensure vendor owns this product
    const product = await prisma.product.findFirst({ where: { id, vendorId } });
    if (!product) throw new Error("Product not found or you don't own it");

    const { vendorId: _v, ...updateData } = data;
    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id: string, vendorId: string): Promise<Product> {
    const product = await prisma.product.findFirst({ where: { id, vendorId } });
    if (!product) throw new Error("Product not found or you don't own it");

    return prisma.product.delete({ where: { id } });
  },

  // Admin-only: unrestricted update/delete
  async adminUpdate(id: string, data: Partial<CreateProductInput>): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  },

  async adminDelete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};
