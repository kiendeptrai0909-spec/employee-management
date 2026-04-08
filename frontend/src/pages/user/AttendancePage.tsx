import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import {
  getMyAttendance,
  checkIn,
  checkOut,
} from "../../services/attendanceService";
import { getCurrentUser } from "../../utils/authStorage";
import StatusBadge from "../../components/common/StatusBadge";

interface AttendanceRow {
  id: number;
  userId: number;
  workDate: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  note: string | null;
}

export default function AttendancePage() {
  const user = getCurrentUser();
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await getMyAttendance(user.id);
      const data = unwrapApiData<AttendanceRow[]>(res);
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCheckIn = async () => {
    if (!user?.id) return;
    setMessage(null);
    try {
      const res = await checkIn(user.id);
      const msg = res.data?.message || "Check-in thành công!";
      setMessage({ text: msg, type: "success" });
      await loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMessage({
        text: axiosErr.response?.data?.message || "Check-in thất bại!",
        type: "danger",
      });
    }
  };

  const handleCheckOut = async () => {
    if (!user?.id) return;
    setMessage(null);
    try {
      const res = await checkOut(user.id);
      const msg = res.data?.message || "Check-out thành công!";
      setMessage({ text: msg, type: "success" });
      await loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMessage({
        text: axiosErr.response?.data?.message || "Check-out thất bại!",
        type: "danger",
      });
    }
  };

  const formatTime = (t: string | null) => {
    if (!t) return "—";
    return t.substring(0, 5);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRow = rows.find((r) => r.workDate === todayStr);

  return (
    <>
      <h1 className="app-page-title">Chấm công</h1>
      <p className="app-page-sub">Ghi nhận giờ vào / ra hàng ngày</p>

      {message && (
        <div className={`alert alert-${message.type} border-0 py-2 small`} role="alert">
          {message.text}
        </div>
      )}

      {/* Today status card */}
      <div className="card mb-4">
        <div className="card-body p-4">
          <h2 className="h5 fw-semibold mb-3">Hôm nay — {todayStr}</h2>
          <div className="row align-items-center g-3">
            <div className="col-auto">
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary rounded-pill px-4"
                  onClick={() => void handleCheckIn()}
                  disabled={!!todayRow?.checkIn}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{verticalAlign: "-2px"}}>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Check-in
                </button>
                <button
                  className="btn btn-outline-primary rounded-pill px-4"
                  onClick={() => void handleCheckOut()}
                  disabled={!todayRow?.checkIn || !!todayRow?.checkOut}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{verticalAlign: "-2px"}}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Check-out
                </button>
              </div>
            </div>
            <div className="col">
              {todayRow ? (
                <div className="d-flex gap-4 text-muted small">
                  <span>
                    Vào: <strong className="text-dark">{formatTime(todayRow.checkIn)}</strong>
                  </span>
                  <span>
                    Ra: <strong className="text-dark">{formatTime(todayRow.checkOut)}</strong>
                  </span>
                  <StatusBadge status={todayRow.status} />
                </div>
              ) : (
                <span className="text-muted small">Chưa có dữ liệu chấm công hôm nay</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>Lịch sử chấm công</span>
          <span className="badge bg-secondary rounded-pill">{rows.length}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-5 text-muted">Chưa có dữ liệu chấm công</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ngày</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-medium">{r.workDate}</td>
                      <td>{formatTime(r.checkIn)}</td>
                      <td>{formatTime(r.checkOut)}</td>
                      <td>
                        <StatusBadge status={r.status} />
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
