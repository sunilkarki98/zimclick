import { prisma } from "../lib/prismaClient";
import { supabase } from "../utils/auth";
import { registerSchema, loginSchema } from "../utils/validators";
import type { CreateUserInput } from "../types";
import { z } from "zod";

export const authService = {
  async register(data: z.infer<typeof registerSchema>) {
    const parsed = registerSchema.parse(data);

    // Check if email already exists in our DB
    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (existing) throw new Error("Email already registered");

    const { data: authData, error } = await supabase.auth.signUp({
      email: parsed.email,
      password: parsed.password,
    });

    if (error) throw new Error(error.message);
    if (!authData.user) throw new Error("Failed to create user");

    const userData: any = {
      id: authData.user.id,
      name: parsed.name,
      email: parsed.email,
      role: "customer",
    };

    const user = await prisma.user.create({ data: userData });

    // Immediately sign in to guarantee a valid session token
    // (signUp can return null session when email confirmation is on)
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });

    return {
      user,
      session: loginData?.session ? {
        access_token: loginData.session.access_token,
        refresh_token: loginData.session.refresh_token,
        expires_at: loginData.session.expires_at,
      } : null,
    };
  },

  async login(data: z.infer<typeof loginSchema>) {
    const parsed = loginSchema.parse(data);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: parsed.email,
      password: parsed.password,
    });

    if (error) throw new Error(error.message);

    let user = await prisma.user.findUnique({
      where: { id: authData.user.id },
    });

    if (!user) {
      // Auto-heal: If user exists in Supabase Auth but not Prisma (e.g. wiped by seed script), recreate them
      user = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          name: authData.user.user_metadata?.name || "Customer",
          role: "customer"
        }
      });
    }

    return {
      user,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },
};
