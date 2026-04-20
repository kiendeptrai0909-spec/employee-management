import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getAllAttendance } from "../../services/adminService";
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

const formatTime = (t: string | null) => (t ? t.substring(0, 5) : "—");

export default function AttendanceReportPage() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllAttendance();
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

  const filtered = rows.filter((r) => {
    if (filterDate && r.workDate !== filterDate) return false;
    if (filterStatus && r.status !== filterStatus) return false;
    return true;
  });

  // Stats
  const presentCount = rows.filter((r) => r.status === "PRESENT").length;
  const absentCount = rows.filter((r) => r.status === "ABSENT").length;

  return (
    <>
      <h1 className="app-page-title">Báo cáo chấm công</h1>
      <p className="app-page-sub">Xem toàn bộ dữ liệu chấm công của nhân viên</p>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="app-stat-card">
            <div className="label">Tổng bản ghi</div>
            <div className="value">{rows.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="app-stat-card">
            <div className="label">Có mặt (PRESENT)</div>
            <div className="value" style={{ color: "#10b981" }}>{presentCount}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="app-stat-card">
            <div className="label">Vắng mặt (ABSENT)</div>
            <div className="value" style={{ color: "#ef4444" }}>{absentCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-secondary">Lọc theo ngày</label>
              <input
                type="date"
                className="form-control"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold text-secondary">Trạng thái</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
                <option value="LATE">LATE</option>
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => { setFilterDate(""); setFilterStatus(""); }}
              >
                Xóa lọc
              </button>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => void loadData()}
              >
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span className="fw-semibold">Danh sách chấm công</span>
          <span className="badge bg-secondary rounded-pill">
            {filtered.length}/{rows.length}
          </span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">Không có dữ liệu</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>Ngày</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-medium">NV #{r.userId}</td>
                      <td className="fw-medium">{r.workDate}</td>
                      <td>{formatTime(r.checkIn)}</td>
                      <td>{formatTime(r.checkOut)}</td>
                      <td><StatusBadge status={r.status} /></td>
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
