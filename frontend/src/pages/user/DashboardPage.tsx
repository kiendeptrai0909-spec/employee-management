import { useEffect, useState } from "react";
import { getCurrentUser } from "../../utils/authStorage";
import { unwrapApiData } from "../../services/api";
import { getMyAttendance } from "../../services/attendanceService";
import { getMyLeaveRequests } from "../../services/leaveService";
import { getMyPayroll } from "../../services/payrollService";

interface Stats {
  totalAttendance: number;
  pendingLeaves: number;
  approvedLeaves: number;
  latestNetSalary: string;
}

const currencyFmt = (val: number | null | undefined) => {
  if (val == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(val);
};

export default function UserDashboardPage() {
  const user = getCurrentUser();
  const [stats, setStats] = useState<Stats>({
    totalAttendance: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    latestNetSalary: "—",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    const loadAll = async () => {
      try {
        const [attRes, leaveRes, payRes] = await Promise.allSettled([
          getMyAttendance(user.id),
          getMyLeaveRequests(user.id),
          getMyPayroll(user.id),
        ]);

        let totalAttendance = 0;
        let pendingLeaves = 0;
        let approvedLeaves = 0;
        let latestNetSalary = "—";

        if (attRes.status === "fulfilled") {
          const data = unwrapApiData<unknown[]>(attRes.value);
          totalAttendance = Array.isArray(data) ? data.length : 0;
        }
        if (leaveRes.status === "fulfilled") {
          const data = unwrapApiData<Array<{ status: string }>>(leaveRes.value);
          if (Array.isArray(data)) {
            pendingLeaves = data.filter((l) => l.status === "PENDING").length;
            approvedLeaves = data.filter((l) => l.status === "APPROVED").length;
          }
        }
        if (payRes.status === "fulfilled") {
          const data = unwrapApiData<Array<{ netSalary: number }>>(payRes.value);
          if (Array.isArray(data) && data.length > 0) {
            latestNetSalary = currencyFmt(data[0].netSalary);
          }
        }

        setStats({ totalAttendance, pendingLeaves, approvedLeaves, latestNetSalary });
      } finally {
        setLoading(false);
      }
    };

    void loadAll();
  }, []);

  return (
    <>
      <h1 className="app-page-title">
        Xin chào{user?.fullName ? `, ${user.fullName}` : ""}
      </h1>
      <p className="app-page-sub">Bạn đang đăng nhập với vai trò nhân viên.</p>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="app-stat-card">
            <div className="label">Ngày chấm công</div>
            <div className="value">{loading ? "…" : stats.totalAttendance}</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="app-stat-card">
            <div className="label">Đơn nghỉ chờ duyệt</div>
            <div className="value">{loading ? "…" : stats.pendingLeaves}</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="app-stat-card">
            <div className="label">Đơn nghỉ đã duyệt</div>
            <div className="value">{loading ? "…" : stats.approvedLeaves}</div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="app-stat-card">
            <div className="label">Lương gần nhất</div>
            <div className="value" style={{ fontSize: "1.35rem", color: "var(--app-primary)" }}>
              {loading ? "…" : stats.latestNetSalary}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome card */}
      <div className="card">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                fontSize: "1.25rem",
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="h5 mb-1 fw-semibold">{user?.fullName ?? "User"}</h2>
              <p className="text-muted small mb-0">
                {user?.username} · {user?.role}
              </p>
            </div>
          </div>
          <p className="text-muted mt-3 mb-0 small">
            Dùng menu bên trái để chấm công, xem bảng lương, gửi đơn nghỉ phép và xem thông báo.
          </p>
        </div>
      </div>
    </>
  );
}
