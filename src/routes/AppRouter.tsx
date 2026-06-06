import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { DashboardPage } from '@/pages/dashboard'
import { FunnelPage } from '@/pages/funnel'
import { LeadsPage } from '@/pages/leads'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { GuestRoute, ProtectedRoute } from '@/routes/ProtectedRoute'

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
  )
}
