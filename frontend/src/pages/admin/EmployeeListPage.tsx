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
import { UserModal, type ModalMode } from "../../components/UserModal";
import type { UserDTO, RoleDTO, DepartmentDTO, PositionDTO } from "../../api/types";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

export default function EmployeeListPage() {
  const [rows, setRows] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [positions, setPositions] = useState<PositionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    mode: ModalMode;
    user: UserDTO | null;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [uRes, rRes, dRes, pRes] = await Promise.allSettled([
      getAllUsers(),
      getRoles(),
      getDepartments(),
      getPositions(),
    ]);

    if (uRes.status === "fulfilled") {
      const list = unwrapApiData(uRes.value);
      setRows(Array.isArray(list) ? list : []);
    } else {
      setRows([]);
    }

    if (rRes.status === "fulfilled") {
      const roleList = unwrapApiData(rRes.value);
      setRoles(Array.isArray(roleList) ? roleList : []);
    } else {
      setRoles([]);
    }

    if (dRes.status === "fulfilled") {
      const deptList = unwrapApiData(dRes.value);
      setDepartments(Array.isArray(deptList) ? deptList : []);
    } else {
      setDepartments([]);
    }

    if (pRes.status === "fulfilled") {
      const posList = unwrapApiData(pRes.value);
      setPositions(Array.isArray(posList) ? posList : []);
    } else {
      setPositions([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreate = async (body: any) => {
    await createUser(body);
    await loadData();
  };

  const handleUpdate = async (id: number, body: any) => {
    await updateUser(id, body);
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;
    await deleteUser(id);
    await loadData();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Nhân viên</h1>
          <p className="mt-1 text-sm text-slate-500">
            Thêm, sửa, xóa và gán phòng ban, chức vụ, quản lý hồ sơ nhân sự đầy đủ.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            type="button" 
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-white/10 active:scale-95" 
            onClick={() => void loadData()}
          >
            Làm mới
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:from-brand-500 hover:to-brand-400 hover:shadow-brand-500/30 active:scale-95 disabled:opacity-50"
            onClick={() => setModal({ mode: "create", user: null })}
          >
            <Plus className="h-5 w-5" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-900/40 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-surface-950/80 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold">Họ tên & Mã NV</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold">Phòng ban</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Chưa có dữ liệu nhân viên.
                  </td>
                </tr>
              ) : (
                rows.map((item, index) => (
                  <tr key={item.id} className="border-b border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 text-slate-300">{item.username}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      {item.fullName}
                      {item.employeeCode && (
                        <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400 font-mono">
                          {item.employeeCode}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.email || "-"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-brand-500/10 px-2 py-0.5 text-xs text-brand-400">
                        {item.roleName || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.departmentName || "-"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          title="Xem chi tiết"
                          onClick={() => setModal({ mode: "view", user: item })}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 text-slate-400 transition-colors hover:bg-brand-500/20 hover:text-brand-400"
                          title="Sửa"
                          onClick={() => setModal({ mode: "edit", user: item })}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-800 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                          title="Xóa"
                          onClick={() => void handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {modal && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          roles={roles}
          departments={departments}
          positions={positions}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
