import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.flatten().fieldErrors });
    return;
  }

  // Handle standard application errors (thrown as new Error("msg"))
  if (err instanceof Error) {
    // Determine status code based on error message common patterns (rudimentary but effective)
    const status = err.message.toLowerCase().includes("not found") ? 404 : 
                   err.message.toLowerCase().includes("unauthorized") || err.message.toLowerCase().includes("forbidden") ? 403 : 
                   400; // default to bad request for business logic throws
    res.status(status).json({ error: err.message });
    return;
  }

  // Fallback
  res.status(500).json({ error: "Internal server error" });
};
