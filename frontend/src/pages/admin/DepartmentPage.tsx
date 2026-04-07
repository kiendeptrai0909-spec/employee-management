import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "../../services/adminService";

interface DepartmentRow {
  id: number;
  name: string;
  description?: string | null;
}

export default function DepartmentPage() {
  const [rows, setRows] = useState<DepartmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getDepartments();
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

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await updateDepartment(editingId, { name: name.trim(), description: description.trim() });
    } else {
      await createDepartment({ name: name.trim(), description: description.trim() });
    }
    resetForm();
    await loadData();
  };

  const handleEdit = (item: DepartmentRow) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || "");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa phòng ban này?")) return;
    await deleteDepartment(id);
    await loadData();
  };

  return (
    <>
      <h1 className="app-page-title">Phòng ban</h1>
      <p className="app-page-sub">Quản lý danh mục phòng ban</p>
      <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 fw-semibold mb-3">Thêm / sửa</h2>
        <form className="row g-2 mb-3" onSubmit={(e) => void handleSubmit(e)}>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Tên phòng ban"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Cập nhật" : "Thêm mới"}
            </button>
            {editingId && (
              <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tên phòng ban</th>
                <th>Mô tả</th>
                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description || "-"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          type="button"
                          onClick={() => handleEdit(item)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          type="button"
                          onClick={() => void handleDelete(item.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
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
