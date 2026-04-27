import { Request, Response, NextFunction } from "express";
import { getUserFromRequest } from "../utils/auth";
import { prisma } from "../lib/prismaClient";

/**
 * Express middleware for authentication and authorization.
 *
 * Usage:
 *   router.get("/protected", requireAuth, handler);
 *   router.post("/admin-only", requireAuth, requireAdmin, handler);
 *   router.post("/vendor-only", requireAuth, requireVendor, handler);
 */

// Extend Express Request to carry user and vendor
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
      };
      vendorId?: string;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized. Please login." });
      return;
    }
    req.user = user;

    // Auto-attach vendorId if user is a vendor (avoids extra lookups later)
    if (user.role === "vendor") {
      const vendor = await prisma.vendor.findUnique({
        where: { userId: user.id },
      });
      if (vendor) req.vendorId = vendor.id;
    }

    next();
  } catch (error: any) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden. Admin access required." });
    return;
  }
  next();
};

export const requireVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || (req.user.role !== "vendor" && req.user.role !== "admin")) {
    res.status(403).json({ error: "Forbidden. Vendor access required." });
    return;
  }

  // vendorId may already be set by requireAuth
  if (!req.vendorId) {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      res.status(403).json({ error: "No vendor profile found. Please register as a vendor first." });
      return;
    }

    req.vendorId = vendor.id;
  }
  next();
};
