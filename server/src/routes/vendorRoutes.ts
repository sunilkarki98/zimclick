import { Router } from "express";
import { vendorService } from "../services/vendorService";
import { productService } from "../services/productService";
import { requireAuth, requireVendor } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// POST /api/vendor/register — any authenticated user can become a vendor
router.post("/register", requireAuth, asyncHandler(async (req, res) => {
  const vendor = await vendorService.register(req.user!.id, req.body);
  res.status(201).json(vendor);
}));

// GET /api/vendor/me — get current vendor's profile
router.get("/me", requireAuth, requireVendor, asyncHandler(async (req, res) => {
  const vendor = await vendorService.getProfile(req.user!.id);
  res.json(vendor);
}));

// PUT /api/vendor/me — update vendor profile
router.put("/me", requireAuth, requireVendor, asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateProfile(req.user!.id, req.body);
  res.json(vendor);
}));

// GET /api/vendor/products — get vendor's own products
router.get("/products", requireAuth, requireVendor, asyncHandler(async (req, res) => {
  const products = await productService.getByVendor(req.vendorId!);
  res.json(products);
}));

// GET /api/vendor/orders — get vendor's incoming sub-orders
router.get("/orders", requireAuth, requireVendor, asyncHandler(async (req, res) => {
  const orders = await vendorService.getVendorOrders(req.vendorId!);
  res.json(orders);
}));

// PATCH /api/vendor/orders/:subOrderId — update sub-order status
router.patch("/orders/:subOrderId", requireAuth, requireVendor, asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }
  const subOrder = await vendorService.updateSubOrderStatus(
    req.user!.id,
    req.params.subOrderId as string,
    status
  );
  res.json(subOrder);
}));

// GET /api/vendor/all — public: list all active vendors
router.get("/all", asyncHandler(async (req, res) => {
  const vendors = await vendorService.getAll();
  res.json(vendors);
}));

// GET /api/vendor/:id — public: get vendor by ID
router.get("/:id", asyncHandler(async (req, res) => {
  const vendor = await vendorService.getById(req.params.id as string);
  res.json(vendor);
}));

export default router;
