import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { FunnelPage } from "@/features/funnel/pages/FunnelPage";
import { LeadsPage } from "@/features/leads/pages/LeadsPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { GuestRoute, ProtectedRoute } from "@/lib/router/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="cadastro" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="funnel" element={<FunnelPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
