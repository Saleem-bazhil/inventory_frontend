import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import * as authApi from "@/api/auth";

export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const login = async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    storeLogin(res.access, res.refresh, res.user);
    navigate("/");
  };

  const logout = () => {
    storeLogout();
    navigate("/login");
  };

  return { user, isAuthenticated, login, logout };
}
