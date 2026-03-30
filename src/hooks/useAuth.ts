import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import * as authApi from "@/api/auth";

export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout, user, isAuthenticated } = useAuthStore();

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    storeLogin(res.access_token, res.user);
    navigate("/");
  };

  const register = async (data: { full_name: string; email: string; password: string }) => {
    const res = await authApi.register(data);
    storeLogin(res.access_token, res.user);
    navigate("/");
  };

  const logout = () => {
    storeLogout();
    navigate("/login");
  };

  return { user, isAuthenticated, login, register, logout };
}
