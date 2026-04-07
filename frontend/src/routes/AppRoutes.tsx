import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/admin/DashboardPage";
import EmployeeListPage from "../pages/admin/EmployeeListPage";
import DepartmentPage from "../pages/admin/DepartmentPage";
import PositionPage from "../pages/admin/PositionPage";
import RolePage from "../pages/admin/RolePage";
import UserDashboardPage from "../pages/user/DashboardPage";
import ProfilePage from "../pages/user/ProfilePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="departments" element={<DepartmentPage />} />
          <Route path="positions" element={<PositionPage />} />
          <Route path="roles" element={<RolePage />} />
          <Route path="leave-approval" element={<Navigate to="/admin/employees" replace />} />
          <Route path="attendance-report" element={<Navigate to="/admin/employees" replace />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute allowRole="USER">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
