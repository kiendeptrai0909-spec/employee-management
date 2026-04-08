import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getMyPayroll } from "../../services/payrollService";
import { getCurrentUser } from "../../utils/authStorage";

interface PayrollRow {
  id: number;
  userId: number;
  month: number;
  year: number;
  basicSalary: number;
  allowance: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  note: string | null;
}

const currencyFmt = (val: number | null | undefined) => {
  if (val == null) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(val);
};

export default function PayrollPage() {
  const user = getCurrentUser();
  const [rows, setRows] = useState<PayrollRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    getMyPayroll(user.id)
      .then((res) => {
        const data = unwrapApiData<PayrollRow[]>(res);
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  // latest payroll for summary card
  const latest = rows.length > 0 ? rows[0] : null;

  return (
    <>
      <h1 className="app-page-title">Bảng lương</h1>
      <p className="app-page-sub">Xem chi tiết lương hàng tháng</p>

      {/* Summary card */}
      {latest && (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="app-stat-card">
              <div className="label">Lương cơ bản</div>
              <div className="value">{currencyFmt(latest.basicSalary)}</div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="app-stat-card">
              <div className="label">Phụ cấp</div>
              <div className="value">{currencyFmt(latest.allowance)}</div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="app-stat-card">
              <div className="label">Thưởng</div>
              <div className="value">{currencyFmt(latest.bonus)}</div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="app-stat-card">
              <div className="label">Thực lĩnh</div>
              <div className="value" style={{ color: "var(--app-primary)" }}>
                {currencyFmt(latest.netSalary)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>Chi tiết lương theo tháng</span>
          <span className="badge bg-secondary rounded-pill">{rows.length}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-5 text-muted">Chưa có dữ liệu bảng lương</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th className="text-end">Lương CB</th>
                    <th className="text-end">Phụ cấp</th>
                    <th className="text-end">Thưởng</th>
                    <th className="text-end">Khấu trừ</th>
                    <th className="text-end">Thực lĩnh</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="fw-medium">
                        {String(r.month).padStart(2, "0")}/{r.year}
                      </td>
                      <td className="text-end">{currencyFmt(r.basicSalary)}</td>
                      <td className="text-end">{currencyFmt(r.allowance)}</td>
                      <td className="text-end text-success">{currencyFmt(r.bonus)}</td>
                      <td className="text-end text-danger">{currencyFmt(r.deduction)}</td>
                      <td className="text-end fw-bold" style={{ color: "var(--app-primary)" }}>
                        {currencyFmt(r.netSalary)}
                      </td>
                      <td className="text-muted small">{r.note || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
