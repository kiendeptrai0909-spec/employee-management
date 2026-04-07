import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getAllUsers, getDepartments, getPositions } from "../../services/adminService";

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, departments: 0, positions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [u, d, p] = await Promise.all([
          getAllUsers(),
          getDepartments(),
          getPositions(),
        ]);
        if (!cancelled) {
          const users = unwrapApiData(u);
          const departments = unwrapApiData(d);
          const positions = unwrapApiData(p);
          setStats({
            users: Array.isArray(users) ? users.length : 0,
            departments: Array.isArray(departments) ? departments.length : 0,
            positions: Array.isArray(positions) ? positions.length : 0,
          });
        }
      } catch {
        if (!cancelled) setStats({ users: 0, departments: 0, positions: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="app-page-title">Tổng quan</h1>
      <p className="app-page-sub">Số liệu nhanh từ hệ thống</p>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="app-stat-card">
            <div className="label">Nhân viên</div>
            <div className="value">{loading ? "…" : stats.users}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="app-stat-card">
            <div className="label">Phòng ban</div>
            <div className="value">{loading ? "…" : stats.departments}</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="app-stat-card">
            <div className="label">Chức vụ</div>
            <div className="value">{loading ? "…" : stats.positions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
