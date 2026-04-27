import { Router } from "express";
import { cartService } from "../services/cartService";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All cart routes require authentication
router.use(requireAuth);

// GET /api/cart — get current user's cart
router.get("/", asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user!.id);
  res.json(cart);
}));

// POST /api/cart — add item to cart
router.post("/", asyncHandler(async (req, res) => {
  const item = await cartService.addItem(req.user!.id, req.body);
  res.status(201).json(item);
}));

// PATCH /api/cart/:itemId — update item quantity
router.patch("/:itemId", asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (typeof quantity !== "number") {
    res.status(400).json({ error: "quantity (number) is required" });
    return;
  }
  const item = await cartService.updateItemQuantity(
    req.user!.id,
    req.params.itemId as string,
    quantity
  );
  res.json(item);
}));

// DELETE /api/cart/:itemId — remove single item
router.delete("/:itemId", asyncHandler(async (req, res) => {
  await cartService.removeItem(req.user!.id, req.params.itemId as string);
  res.json({ message: "Item removed" });
}));

// DELETE /api/cart — clear entire cart
router.delete("/", asyncHandler(async (req, res) => {
  const result = await cartService.clearCart(req.user!.id);
  res.json(result);
}));

export default router;
