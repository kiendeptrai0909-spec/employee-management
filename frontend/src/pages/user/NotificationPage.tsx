import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getAllNotifications } from "../../services/notificationService";

interface NotificationRow {
  id: number;
  title: string;
  content: string;
  targetType: string;
  roleId: number | null;
  departmentId: number | null;
  userId: number | null;
  createdBy: number | null;
  isPublished: boolean;
}

const targetLabel = (type: string) => {
  switch (type) {
    case "ALL":
      return { text: "Toàn hệ thống", cls: "bg-primary" };
    case "DEPARTMENT":
      return { text: "Phòng ban", cls: "bg-info" };
    case "ROLE":
      return { text: "Vai trò", cls: "bg-warning text-dark" };
    case "USER":
      return { text: "Cá nhân", cls: "bg-success" };
    default:
      return { text: type, cls: "bg-secondary" };
  }
};

export default function NotificationPage() {
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllNotifications()
      .then((res) => {
        const data = unwrapApiData<NotificationRow[]>(res);
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="app-page-title">Thông báo</h1>
      <p className="app-page-sub">Xem các thông báo từ hệ thống và quản trị</p>

      {loading ? (
        <div className="text-center py-5 text-muted">Đang tải...</div>
      ) : rows.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5 text-muted">
            Chưa có thông báo nào
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {rows.map((n) => {
            const tl = targetLabel(n.targetType);
            return (
              <div key={n.id} className="card">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div>
                      <h3 className="h6 fw-semibold mb-1">{n.title}</h3>
                      <p className="mb-0 text-muted small" style={{ whiteSpace: "pre-wrap" }}>
                        {n.content}
                      </p>
                    </div>
                    <span className={`badge rounded-pill px-2 py-1 flex-shrink-0 ${tl.cls}`}>
                      {tl.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
