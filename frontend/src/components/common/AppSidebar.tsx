import { NavLink } from "react-router-dom";

interface AppSidebarProps {
  role: "ADMIN" | "USER";
}

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="11" width="7" height="10" rx="1" />
    <rect x="3" y="15" width="7" height="6" rx="1" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconBuilding = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v0" />
    <path d="M9 12v0" />
    <path d="M9 15v0" />
    <path d="M9 18v0" />
  </svg>
);

const IconBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function AppSidebar({ role }: AppSidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "active" : ""}`;

  if (role === "USER") {
    return (
      <aside className="app-sidebar-inner">
        <div className="app-sidebar-label">Menu</div>
        <nav className="nav flex-column app-sidebar">
          <NavLink to="/user" end className={linkClass}>
            <IconDashboard />
            Tổng quan
          </NavLink>
          <NavLink to="/user/profile" className={linkClass}>
            <IconUser />
            Hồ sơ cá nhân
          </NavLink>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="app-sidebar-inner">
      <div className="app-sidebar-label">Quản trị</div>
      <nav className="nav flex-column app-sidebar">
        <NavLink to="/admin" end className={linkClass}>
          <IconDashboard />
          Tổng quan
        </NavLink>
        <NavLink to="/admin/employees" className={linkClass}>
          <IconUsers />
          Nhân viên
        </NavLink>
        <NavLink to="/admin/departments" className={linkClass}>
          <IconBuilding />
          Phòng ban
        </NavLink>
        <NavLink to="/admin/positions" className={linkClass}>
          <IconBriefcase />
          Chức vụ
        </NavLink>
        <NavLink to="/admin/roles" className={linkClass}>
          <IconShield />
          Vai trò
        </NavLink>
      </nav>
    </aside>
  );
}
