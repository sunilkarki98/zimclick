import { api } from "./api";
import { supabase } from "../lib/supabaseClient";

/**
 * Since Supabase handles authenticating the user from the client side,
 * this auth service primarily exists to trigger backend registration/login sync.
 */
export const authService = {
  /**
   * Syncs a newly created Supabase user to the backend User table.
   * The actual sign up happens via Supabase first, then this registers them in Prisma.
   */
  registerBackend: (name: string, email: string) => {
    // In our backend, the /api/auth/register endpoint actually creates the Supabase user too.
    // However, if we're using client-side Supabase, we might want to bypass backend auth, 
    // OR we can just hit the backend endpoint and let it do both. 
    // The current backend register creates it in Supabase Admin AND Prisma.
    // If you are doing client-side signup:
    // This is a placeholder; you'd typically hit your Express endpoints.
  },
};
