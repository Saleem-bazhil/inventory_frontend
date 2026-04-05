import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { tokenStore } from "@/api/tokenStore";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (access: string, refresh: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (access, refresh, user) => {
        tokenStore.setAccess(access);
        localStorage.setItem("refresh-token", refresh);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        tokenStore.clear();
        localStorage.removeItem("refresh-token");
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      // Only persist user identity — never the access token
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
