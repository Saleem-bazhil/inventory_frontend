import { Outlet } from "react-router-dom";
import { AppLayout } from "./AppLayout";

export function ProtectedRoute() {
  // TODO: re-enable auth check when backend is connected
  // const { isAuthenticated } = useAuthStore();
  // if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
