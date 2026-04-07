import { Link, NavLink, Outlet } from "react-router-dom";
import { Building2, LayoutDashboard, LogIn, LogOut } from "lucide-react";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-brand-600/20 text-brand-400 shadow-inner"
      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
  }`;

export interface SessionUser {
  username: string;
  fullName: string;
  roleName: string;
}

interface LayoutProps {
  user: SessionUser | null;
  onLogout: () => void;
}

export function Layout({ user, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/5 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow">
              <Building2 className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white group-hover:text-brand-400 transition">
                Employee System
              </p>
              <p className="text-xs text-slate-500">Quản lý nhân viên</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={navClass}>
              <LayoutDashboard className="h-4 w-4" />
              Trang chủ
            </NavLink>
            <NavLink to="/employees" className={navClass}>
              <Building2 className="h-4 w-4" />
              Nhân viên
            </NavLink>
            {user ? (
              <>
                <span className="hidden sm:inline text-xs text-slate-500 px-2">
                  {user.fullName}
                  <span className="text-slate-600"> · </span>
                  {user.roleName}
                </span>
                <button type="button" onClick={onLogout} className="btn-ghost">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </>
            ) : (
              <NavLink to="/login" className={navClass}>
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-600">
        Spring Boot · React · REST API · MySQL · CI/CD — Bài tập quản lý nhân viên
      </footer>
    </div>
  );
}
