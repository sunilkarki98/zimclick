import { Router } from "express";
import { productService } from "../services/productService";
import { requireAuth, requireVendor } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// GET /api/products — Public: list all products (includes vendor info)
router.get("/", asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);  // Cap at 100
  const offset = Number(req.query.offset) || 0;
  const products = await productService.getAll(limit, offset);
  res.json(products);
}));

// GET /api/products/:id — Public: get single product
router.get("/:id", asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id as string);
  res.json(product);
}));

// POST /api/products — Vendor: create product under their store
router.post("/", requireAuth, requireVendor, asyncHandler(async (req, res) => {
  const product = await productService.create({
    ...req.body,
    vendorId: req.vendorId!,
  });
  res.status(201).json(product);
}));

// PUT /api/products/:id — Vendor: update own product | Admin: update any
router.put("/:id", requireAuth, asyncHandler(async (req, res) => {
  let product;
  if (req.user!.role === "admin") {
    product = await productService.adminUpdate(req.params.id as string, req.body);
  } else if (req.user!.role === "vendor" && req.vendorId) {
    product = await productService.update(req.params.id as string, req.vendorId, req.body);
  } else {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json(product);
}));

// DELETE /api/products/:id — Vendor: delete own product | Admin: delete any
router.delete("/:id", requireAuth, asyncHandler(async (req, res) => {
  if (req.user!.role === "admin") {
    await productService.adminDelete(req.params.id as string);
  } else if (req.user!.role === "vendor" && req.vendorId) {
    await productService.delete(req.params.id as string, req.vendorId);
  } else {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json({ message: "Product deleted" });
}));

export default router;
