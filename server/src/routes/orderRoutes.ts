import { Router } from "express";
import { orderService } from "../services/orderService";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// All order routes require authentication
router.use(requireAuth);

// GET /api/orders — list user's order history
router.get("/", asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders(req.user!.id);
  res.json(orders);
}));

// GET /api/orders/:id — get single order detail
router.get("/:id", asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user!.id, req.params.id as string);
  res.json(order);
}));

// POST /api/orders — checkout (create order from cart)
router.post("/", asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user!.id);
  res.status(201).json(order);
}));

export default router;
