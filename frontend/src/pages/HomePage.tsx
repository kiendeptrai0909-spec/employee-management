import { Link } from "react-router-dom";
import { ArrowRight, Database, Layers, Server } from "lucide-react";

export function HomePage() {
  return (
    <div className="animate-fade-in space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-surface-900/90 to-surface-950 p-10 shadow-glow sm:p-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative max-w-2xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400">
            REST API · CRUD đầy đủ
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Hệ thống quản lý{" "}
            <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
              nhân viên
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Giao diện web hiện đại kết nối backend Spring Boot: xem danh sách, thêm,
            sửa, xóa và tra cứu chi tiết nhân viên — đáp ứng yêu cầu bài tập với trải
            nghiệm chỉn chu.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/employees" className="btn-primary">
              Vào quản lý nhân viên
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-ghost">
              Đăng nhập demo
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Server,
            title: "Spring Boot",
            desc: "REST API chuẩn, phân tầng service/controller.",
          },
          {
            icon: Database,
            title: "MySQL",
            desc: "Bảng users và quan hệ role, phòng ban, chức vụ.",
          },
          {
            icon: Layers,
            title: "React + Vite",
            desc: "SPA nhanh, TypeScript, Tailwind, proxy dev.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-surface-900/50 p-6 shadow-card transition hover:border-brand-500/25 hover:shadow-glow"
          >
            <Icon className="mb-4 h-8 w-8 text-brand-400" />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
