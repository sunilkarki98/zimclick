import type { User as PrismaUser } from "../generated/client";

export type User = PrismaUser;

export interface CreateUserInput {
  id: string;        // Supabase auth UID
  name: string;
  email: string;
}
