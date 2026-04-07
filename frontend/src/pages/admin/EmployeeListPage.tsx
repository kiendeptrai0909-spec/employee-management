import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getDepartments,
  getPositions,
  getRoles,
  updateUser,
} from "../../services/adminService";
import StatusBadge from "../../components/common/StatusBadge";

interface EmployeeRow {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  roleId?: number;
  roleName?: string;
  departmentId?: number | null;
  departmentName?: string;
  positionId?: number | null;
  positionName?: string;
  status: string;
}

interface OptionItem {
  id: number;
  name: string;
}

export default function EmployeeListPage() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [roles, setRoles] = useState<OptionItem[]>([]);
  const [departments, setDepartments] = useState<OptionItem[]>([]);
  const [positions, setPositions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    roleId: "",
    departmentId: "",
    positionId: "",
    status: "ACTIVE",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes, dRes, pRes] = await Promise.all([
        getAllUsers(),
        getRoles(),
        getDepartments(),
        getPositions(),
      ]);
      const list = unwrapApiData(uRes);
      const roleList = unwrapApiData(rRes);
      const deptList = unwrapApiData(dRes);
      const posList = unwrapApiData(pRes);
      setRows(Array.isArray(list) ? list : []);
      setRoles(Array.isArray(roleList) ? roleList : []);
      setDepartments(Array.isArray(deptList) ? deptList : []);
      setPositions(Array.isArray(posList) ? posList : []);
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
    setEditingId(null);
    setForm({
      username: "",
      password: "",
      fullName: "",
      email: "",
      roleId: "",
      departmentId: "",
      positionId: "",
      status: "ACTIVE",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.roleId) return;

    if (editingId) {
      await updateUser(editingId, {
        fullName: form.fullName.trim(),
        email: form.email.trim() || undefined,
        roleId: Number(form.roleId),
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        positionId: form.positionId ? Number(form.positionId) : null,
        status: form.status,
      });
    } else {
      if (!form.username.trim() || !form.password.trim()) return;
      await createUser({
        username: form.username.trim(),
        password: form.password.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim() || undefined,
        roleId: Number(form.roleId),
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        positionId: form.positionId ? Number(form.positionId) : null,
      });
    }

    resetForm();
    await loadData();
  };

  const handleEdit = (item: EmployeeRow) => {
    setEditingId(item.id);
    setForm({
      username: item.username || "",
      password: "",
      fullName: item.fullName || "",
      email: item.email || "",
      roleId: item.roleId ? String(item.roleId) : "",
      departmentId: item.departmentId ? String(item.departmentId) : "",
      positionId: item.positionId ? String(item.positionId) : "",
      status: item.status || "ACTIVE",
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa nhân viên này?")) return;
    await deleteUser(id);
    await loadData();
  };

  return (
    <>
      <h1 className="app-page-title">Nhân viên</h1>
      <p className="app-page-sub">Thêm, sửa, xóa và gán phòng ban, chức vụ</p>
      <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h2 className="h5 mb-0 fw-semibold">Danh sách</h2>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
            onClick={() => void loadData()}
          >
            Làm mới
          </button>
        </div>
        <form className="row g-2 mb-3" onSubmit={(e) => void handleSubmit(e)}>
          {!editingId && (
            <>
              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
            </>
          )}
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Họ tên"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.roleId}
              onChange={(e) => setForm((prev) => ({ ...prev, roleId: e.target.value }))}
              required
            >
              <option value="">Chọn role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.departmentId}
              onChange={(e) => setForm((prev) => ({ ...prev, departmentId: e.target.value }))}
            >
              <option value="">Phòng ban</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={form.positionId}
              onChange={(e) => setForm((prev) => ({ ...prev, positionId: e.target.value }))}
            >
              <option value="">Chức vụ</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {editingId && (
            <div className="col-md-2">
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          )}
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}
            </button>
            {editingId && (
              <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Trạng thái</th>
                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center">
                    Chưa có dữ liệu
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.fullName}</td>
                    <td>{item.email || "-"}</td>
                    <td>{item.roleName || "-"}</td>
                    <td>{item.departmentName || "-"}</td>
                    <td>{item.positionName || "-"}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
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
