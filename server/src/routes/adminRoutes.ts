import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { prisma } from "../lib/prismaClient";
import { productService } from "../services/productService";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Secure all admin routes
router.use(requireAuth, requireAdmin);

// ---------- USERS ----------
router.get("/users", asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { vendor: true }
  });
  res.json(users);
}));

router.put("/users/:id/role", asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["customer", "vendor", "admin"].includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
  }

  const user = await prisma.user.update({
    where: { id: req.params.id as string },
    data: { role },
    include: { vendor: true }
  });
  res.json(user);
}));

// ---------- VENDORS ----------
router.get("/vendors", asyncHandler(async (req, res) => {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });
  res.json(vendors);
}));

router.put("/vendors/:id/status", asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const vendor = await prisma.vendor.update({
    where: { id: req.params.id as string },
    data: { isActive },
    include: { user: true }
  });
  res.json(vendor);
}));

// ---------- PRODUCTS ----------
router.delete("/products/:id", asyncHandler(async (req, res) => {
  const product = await productService.adminDelete(req.params.id as string);
  res.json({ message: "Product deleted", product });
}));

export default router;
