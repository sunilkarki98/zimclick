import { Router } from "express";
import { authService } from "../services/authService";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/register", asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}));

router.post("/login", asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
}));

router.post("/logout", asyncHandler(async (req, res) => {
  await authService.logout();
  res.status(200).json({ message: "Logged out" });
}));

export default router;
