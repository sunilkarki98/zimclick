import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { prisma } from "../lib/prismaClient";
import type { Request } from "express";

// A single instance of Supabase Client for the server
export const supabase = createSupabaseClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

export const getUserFromRequest = async (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  return dbUser;
};
