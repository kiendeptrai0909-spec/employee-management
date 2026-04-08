import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import {
  getMyLeaveRequests,
  createLeaveRequest,
  type LeaveRequestPayload,
} from "../../services/leaveService";
import { getCurrentUser } from "../../utils/authStorage";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDate } from "../../utils/format";

interface LeaveRow {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: string;
  approvedBy: number | null;
  processedAt: string | null;
}

const LEAVE_TYPES = [
  { value: "PAID", label: "Nghỉ phép (có lương)" },
  { value: "SICK", label: "Nghỉ bệnh" },
  { value: "UNPAID", label: "Nghỉ không lương" },
];

const emptyForm: Omit<LeaveRequestPayload, "userId"> = {
  startDate: "",
  endDate: "",
  leaveType: "PAID",
  reason: "",
};

export default function LeaveRequestPage() {
  const user = getCurrentUser();
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const loadData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await getMyLeaveRequests(user.id);
      const data = unwrapApiData<LeaveRow[]>(res);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSubmitting(true);
    setMessage(null);
    try {
      await createLeaveRequest({ ...form, userId: user.id });
      setMessage({ text: "Tạo đơn xin nghỉ thành công!", type: "success" });
      setForm(emptyForm);
      setShowForm(false);
      await loadData();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMessage({
        text: axiosErr.response?.data?.message || "Tạo đơn thất bại!",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const leaveTypeLabel = (val: string) =>
    LEAVE_TYPES.find((t) => t.value === val)?.label || val;

  return (
    <>
      <h1 className="app-page-title">Đơn xin nghỉ</h1>
      <p className="app-page-sub">Tạo và theo dõi đơn xin nghỉ phép</p>

      {message && (
        <div className={`alert alert-${message.type} border-0 py-2 small`} role="alert">
          {message.text}
        </div>
      )}

      {/* Toggle form */}
      <div className="mb-4">
        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>✕ Đóng</>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{verticalAlign: "-2px"}}>
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Tạo đơn mới
            </>
          )}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header fw-semibold">Tạo đơn xin nghỉ</div>
          <div className="card-body p-4">
            <form className="row g-3" onSubmit={(e) => void handleSubmit(e)}>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Loại nghỉ phép</label>
                <select
                  className="form-select"
                  value={form.leaveType}
                  onChange={(e) => setForm((prev) => ({ ...prev, leaveType: e.target.value }))}
                >
                  {LEAVE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Từ ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold text-secondary">Đến ngày</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Lý do</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Nhập lý do xin nghỉ..."
                  value={form.reason}
                  onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}
                  required
                />
              </div>
              <div className="col-12 pt-1">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4"
                  disabled={submitting}
                >
                  {submitting ? "Đang gửi..." : "Gửi đơn"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4 ms-2"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave requests table */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>Danh sách đơn nghỉ</span>
          <span className="badge bg-secondary rounded-pill">{rows.length}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-5 text-muted">Chưa có đơn xin nghỉ</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Loại nghỉ</th>
                    <th>Từ ngày</th>
                    <th>Đến ngày</th>
                    <th>Lý do</th>
                    <th>Trạng thái</th>
                    <th>Xử lý lúc</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td>
                        <span className="badge bg-info bg-opacity-10 text-info">
                          {leaveTypeLabel(r.leaveType)}
                        </span>
                      </td>
                      <td className="fw-medium">{formatDate(r.startDate)}</td>
                      <td className="fw-medium">{formatDate(r.endDate)}</td>
                      <td className="small" style={{ maxWidth: 220 }}>
                        {r.reason || "—"}
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="text-muted small">{r.processedAt ? formatDate(r.processedAt) : "—"}</td>
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
