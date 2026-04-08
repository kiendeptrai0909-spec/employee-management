import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getAllDocuments } from "../../services/documentService";

interface DocumentRow {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  fileUrl: string;
  roleScope: string;
  departmentId: number | null;
  createdBy: number | null;
}

const scopeLabel = (scope: string) => {
  switch (scope) {
    case "ALL":
      return { text: "Tất cả", cls: "bg-primary" };
    case "ADMIN":
      return { text: "Admin", cls: "bg-danger" };
    case "USER":
      return { text: "Nhân viên", cls: "bg-success" };
    default:
      return { text: scope, cls: "bg-secondary" };
  }
};

export default function DocumentPage() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllDocuments()
      .then((res) => {
        const data = unwrapApiData<DocumentRow[]>(res);
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="app-page-title">Tài liệu</h1>
      <p className="app-page-sub">Xem và tải tài liệu nội bộ</p>

      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <span>Danh sách tài liệu</span>
          <span className="badge bg-secondary rounded-pill">{rows.length}</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Đang tải...</div>
          ) : rows.length === 0 ? (
            <div className="text-center py-5 text-muted">Chưa có tài liệu</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tiêu đề</th>
                    <th>Mô tả</th>
                    <th>Danh mục</th>
                    <th>Phạm vi</th>
                    <th>Tải về</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d, idx) => {
                    const sl = scopeLabel(d.roleScope);
                    return (
                      <tr key={d.id}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="fw-medium">{d.title}</td>
                        <td className="text-muted small" style={{ maxWidth: 250 }}>
                          {d.description || "—"}
                        </td>
                        <td>
                          {d.category ? (
                            <span className="badge bg-light text-dark border">{d.category}</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <span className={`badge rounded-pill px-2 py-1 ${sl.cls}`}>{sl.text}</span>
                        </td>
                        <td>
                          <a
                            href={d.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1" style={{verticalAlign: "-1px"}}>
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Mở
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
