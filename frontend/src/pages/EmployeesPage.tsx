import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { createUser, deleteUser, fetchUsers, updateUser } from "../api/usersApi";
import { fetchDepartments, fetchPositions, fetchRoles } from "../api/metaApi";
import { ApiError } from "../api/client";
import type {
  DepartmentDTO,
  PositionDTO,
  RoleDTO,
  UserCreateRequest,
  UserDTO,
  UserUpdateRequest,
} from "../api/types";
import { useToast } from "../context/ToastContext";
import { UserModal, type ModalMode } from "../components/UserModal";

function formatApiError(err: unknown): string {
  if (err instanceof ApiError) {
    const b = err.body;
    if (b && typeof b === "object" && !Array.isArray(b)) {
      const o = b as Record<string, string>;
      const parts = Object.entries(o).map(([k, v]) => `${k}: ${v}`);
      if (parts.length) return parts.join(" · ");
    }
    return err.message;
  }
  return "Đã xảy ra lỗi.";
}

export function EmployeesPage() {
  const toast = useToast();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [positions, setPositions] = useState<PositionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{
    mode: ModalMode;
    user: UserDTO | null;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r, d, p] = await Promise.all([
        fetchUsers(),
        fetchRoles(),
        fetchDepartments(),
        fetchPositions(),
      ]);
      setUsers(u.data);
      setRoles(r.data);
      setDepartments(d.data);
      setPositions(p.data);
    } catch (e) {
      toast.push(formatApiError(e), "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (x) =>
        x.fullName.toLowerCase().includes(q) ||
        (x.email?.toLowerCase().includes(q) ?? false) ||
        (x.phone?.includes(q) ?? false) ||
        x.username.toLowerCase().includes(q)
    );
  }, [users, query]);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === "ACTIVE").length;
    return { total: users.length, active };
  }, [users]);

  async function handleCreate(body: UserCreateRequest) {
    try {
      const res = await createUser(body);
      setUsers((prev) => [...prev, res.data]);
      toast.push(res.message || "Đã tạo nhân viên", "success");
    } catch (e) {
      toast.push(formatApiError(e), "error");
      throw e;
    }
  }

  async function handleUpdate(id: number, body: UserUpdateRequest) {
    try {
      const res = await updateUser(id, body);
      setUsers((prev) => prev.map((u) => (u.id === id ? res.data : u)));
      toast.push(res.message || "Đã cập nhật", "success");
    } catch (e) {
      toast.push(formatApiError(e), "error");
      throw e;
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      const res = await deleteUser(deleteId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
      toast.push(res.message || "Đã xóa", "success");
      setDeleteId(null);
    } catch (e) {
      toast.push(formatApiError(e), "error");
    } finally {
      setDeleting(false);
    }
  }

  const canOpenModal = roles.length > 0;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Nhân viên</h1>
          <p className="mt-1 text-sm text-slate-500">
            CRUD đầy đủ: danh sách, xem chi tiết, thêm, sửa, xóa — đồng bộ REST API
            backend.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => void loadAll()}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canOpenModal}
            onClick={() => setModal({ mode: "create", user: null })}
            title={!canOpenModal ? "Đang tải roles…" : undefined}
          >
            <Plus className="h-4 w-4" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Tổng số
              </p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-surface-900/60 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Đang hoạt động
              </p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          className="input-field pl-11"
          placeholder="Tìm theo tên, email, SĐT, username…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-900/40 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-surface-950/80 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Họ tên</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Điện thoại</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                    Đang tải dữ liệu…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                    {query ? "Không có bản ghi khớp tìm kiếm." : "Chưa có nhân viên nào."}
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{row.fullName}</td>
                    <td className="px-4 py-3 text-slate-400">{row.email ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {row.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-brand-500/10 px-2 py-0.5 text-xs text-brand-400">
                        {row.roleName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-xs ${
                          row.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-slate-500/15 text-slate-400"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                          title="Xem"
                          onClick={() => setModal({ mode: "view", user: row })}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-brand-400"
                          title="Sửa"
                          onClick={() => setModal({ mode: "edit", user: row })}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-500/15 hover:text-red-400"
                          title="Xóa"
                          onClick={() => setDeleteId(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {deleteId != null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteId(null)}
            aria-label="Hủy"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-surface-900 p-6 shadow-glow animate-slide-up">
            <h3 className="text-lg font-semibold text-white">Xóa nhân viên?</h3>
            <p className="mt-2 text-sm text-slate-400">
              Hành động này không thể hoàn tác. Bản ghi sẽ bị xóa khỏi CSDL.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="btn-ghost"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-danger"
                disabled={deleting}
                onClick={() => void confirmDelete()}
              >
                {deleting ? "Đang xóa…" : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View modal extra: show timestamps in view — handled inside UserModal */}
      <p className="text-center text-xs text-slate-600">
        Gợi ý: bật backend tại <code className="font-mono text-brand-500/80">localhost:8080</code>{" "}
        và chạy <code className="font-mono text-brand-500/80">npm run dev</code> (proxy API).
      </p>
    </div>
  );
}
