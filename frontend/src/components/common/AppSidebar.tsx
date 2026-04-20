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

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconWallet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconFile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
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
          <NavLink to="/user/attendance" className={linkClass}>
            <IconClock />
            Chấm công
          </NavLink>
          <NavLink to="/user/leave-requests" className={linkClass}>
            <IconCalendar />
            Đơn xin nghỉ
          </NavLink>
          <NavLink to="/user/payroll" className={linkClass}>
            <IconWallet />
            Bảng lương
          </NavLink>
          <NavLink to="/user/notifications" className={linkClass}>
            <IconBell />
            Thông báo
          </NavLink>
          <NavLink to="/user/documents" className={linkClass}>
            <IconFile />
            Tài liệu
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
        <NavLink to="/admin/leave-approval" className={linkClass}>
          <IconCalendar />
          Phê duyệt nghỉ phép
        </NavLink>
        <NavLink to="/admin/attendance-report" className={linkClass}>
          <IconClock />
          Báo cáo chấm công
        </NavLink>
      </nav>
    </aside>
  );
}
