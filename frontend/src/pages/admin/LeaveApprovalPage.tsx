import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getAllLeaveRequests, updateLeaveStatus } from "../../services/adminService";
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

const LEAVE_TYPE_LABELS: Record<string, string> = {
  PAID: "Nghỉ phép (có lương)",
  SICK: "Nghỉ bệnh",
  UNPAID: "Nghỉ không lương",
};

export default function LeaveApprovalPage() {
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "danger" } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveRequests();
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

  const handleAction = async (id: number, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    setMessage(null);
    try {
      await updateLeaveStatus(id, status);
      setMessage({
        text: status === "APPROVED" ? "Đã duyệt đơn nghỉ." : "Đã từ chối đơn nghỉ.",
        type: "success",
      });
      await loadData();
    } catch {
      setMessage({ text: "Thao tác thất bại. Vui lòng thử lại.", type: "danger" });
    } finally {
      setProcessingId(null);
    }
  };

  const pending = rows.filter((r) => r.status === "PENDING");
  const processed = rows.filter((r) => r.status !== "PENDING");

  return (
    <>
      <h1 className="app-page-title">Phê duyệt nghỉ phép</h1>
      <p className="app-page-sub">Xem xét và phê duyệt đơn xin nghỉ của nhân viên</p>

      {message && (
        <div className={`alert alert-${message.type} border-0 py-2 small`} role="alert">
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="app-stat-card">
            <div className="label">Tổng đơn</div>
            <div className="value">{rows.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="app-stat-card">
            <div className="label">Chờ duyệt</div>
            <div className="value" style={{ color: "#f59e0b" }}>{pending.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="app-stat-card">
            <div className="label">Đã xử lý</div>
            <div className="value" style={{ color: "#10b981" }}>{processed.length}</div>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span className="fw-semibold">⏳ Chờ phê duyệt</span>
          <span className="badge bg-warning text-dark rounded-pill">{pending.length}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-4 text-muted">Đang tải...</div>
          ) : pending.length === 0 ? (
            <div className="text-center py-4 text-muted">Không có đơn nào chờ duyệt</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>Loại nghỉ</th>
                    <th>Từ ngày</th>
                    <th>Đến ngày</th>
                    <th>Lý do</th>
                    <th>Trạng thái</th>
                    <th style={{ width: 200 }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-medium">NV #{r.userId}</td>
                      <td>
                        <span className="badge bg-info bg-opacity-15 text-info">
                          {LEAVE_TYPE_LABELS[r.leaveType] ?? r.leaveType}
                        </span>
                      </td>
                      <td>{formatDate(r.startDate)}</td>
                      <td>{formatDate(r.endDate)}</td>
                      <td className="small text-muted" style={{ maxWidth: 220 }}>{r.reason || "—"}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success rounded-pill px-3"
                            disabled={processingId === r.id}
                            onClick={() => void handleAction(r.id, "APPROVED")}
                          >
                            ✓ Duyệt
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            disabled={processingId === r.id}
                            onClick={() => void handleAction(r.id, "REJECTED")}
                          >
                            ✗ Từ chối
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Processed */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span className="fw-semibold">📋 Đã xử lý</span>
          <span className="badge bg-secondary rounded-pill">{processed.length}</span>
        </div>
        <div className="card-body p-0">
          {processed.length === 0 ? (
            <div className="text-center py-4 text-muted">Chưa có đơn nào được xử lý</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User ID</th>
                    <th>Loại nghỉ</th>
                    <th>Từ ngày</th>
                    <th>Đến ngày</th>
                    <th>Trạng thái</th>
                    <th>Xử lý lúc</th>
                  </tr>
                </thead>
                <tbody>
                  {processed.map((r, idx) => (
                    <tr key={r.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-medium">NV #{r.userId}</td>
                      <td>
                        <span className="badge bg-info bg-opacity-15 text-info">
                          {LEAVE_TYPE_LABELS[r.leaveType] ?? r.leaveType}
                        </span>
                      </td>
                      <td>{formatDate(r.startDate)}</td>
                      <td>{formatDate(r.endDate)}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td className="text-muted small">
                        {r.processedAt ? formatDate(r.processedAt) : "—"}
                      </td>
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
