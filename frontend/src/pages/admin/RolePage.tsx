import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getRoles } from "../../services/adminService";

interface RoleRow {
  id: number;
  name: string;
  description?: string | null;
}

export default function RolePage() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getRoles();
      const list = unwrapApiData(response);
      setRows(Array.isArray(list) ? list : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <>
      <h1 className="app-page-title">Vai trò</h1>
      <p className="app-page-sub">Danh sách vai trò trong hệ thống (chỉ xem)</p>
      <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 fw-semibold mb-3">Danh sách</h2>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tên vai trò</th>
                <th>Mô tả</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}
