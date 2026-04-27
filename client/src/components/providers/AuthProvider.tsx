"use client";

import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/lib/supabaseClient";
import { api } from "@/services/api";
import type { User } from "@/types";
import { setUser, setLoading, clearAuth } from "@/store/authSlice";
import { RootState } from "@/store";

interface AuthContextType {
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  refreshUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        dispatch(clearAuth());
        dispatch(setLoading(false));
        return;
      }

      // Fetch the custom User profile from our Express backend
      // This includes the actual Prisma role ('customer', 'vendor', 'admin')
      const res = await api.get<{ user: User }>("/auth/me");
      dispatch(setUser(res.user));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchUser();
      } else if (event === "SIGNED_OUT") {
        dispatch(clearAuth());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]); // Included dispatch in dependencies

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
  };

  return (
    <AuthContext.Provider
      value={{
        refreshUser: fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { refreshUser, logout } = useContext(AuthContext);

  return {
    ...authState,
    refreshUser,
    logout,
  };
};
