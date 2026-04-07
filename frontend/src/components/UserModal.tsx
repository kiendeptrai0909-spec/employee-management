import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import type {
  DepartmentDTO,
  PositionDTO,
  RoleDTO,
  UserCreateRequest,
  UserDTO,
  UserUpdateRequest,
} from "../api/types";
import { formatDateTime } from "../utils/format";

export type ModalMode = "create" | "edit" | "view";

interface UserModalProps {
  mode: ModalMode;
  user: UserDTO | null;
  roles: RoleDTO[];
  departments: DepartmentDTO[];
  positions: PositionDTO[];
  onClose: () => void;
  onCreate: (body: UserCreateRequest) => Promise<void>;
  onUpdate: (id: number, body: UserUpdateRequest) => Promise<void>;
}

const emptyCreate: UserCreateRequest = {
  username: "",
  password: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  gender: "",
  roleId: 0,
  departmentId: null,
  positionId: null,
};

export function UserModal({
  mode,
  user,
  roles,
  departments,
  positions,
  onClose,
  onCreate,
  onUpdate,
}: UserModalProps) {
  const [create, setCreate] = useState<UserCreateRequest>(emptyCreate);
  const [edit, setEdit] = useState<UserUpdateRequest>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "create") {
      const firstRole = roles[0]?.id ?? 0;
      setCreate({
        ...emptyCreate,
        roleId: firstRole,
      });
    } else if (user && (mode === "edit" || mode === "view")) {
      setEdit({
        fullName: user.fullName,
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        dateOfBirth: user.dateOfBirth ?? "",
        gender: user.gender ?? "",
        status: user.status,
        roleId: user.roleId,
        departmentId: user.departmentId,
        positionId: user.positionId,
      });
    }
  }, [mode, user, roles]);

  const readOnly = mode === "view";

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (readOnly) return;
    setSaving(true);
    try {
      if (mode === "create") {
        const body: UserCreateRequest = {
          ...create,
          email: create.email?.trim() || undefined,
          phone: create.phone?.trim() || undefined,
          address: create.address?.trim() || undefined,
          dateOfBirth: create.dateOfBirth?.trim() || undefined,
          gender: create.gender?.trim() || undefined,
          departmentId: create.departmentId ?? null,
          positionId: create.positionId ?? null,
        };
        await onCreate(body);
      } else if (mode === "edit" && user) {
        const body: UserUpdateRequest = {
          ...edit,
          email: edit.email?.trim() || undefined,
          phone: edit.phone?.trim() || undefined,
          address: edit.address?.trim() || undefined,
          dateOfBirth: edit.dateOfBirth?.trim() || undefined,
          gender: edit.gender?.trim() || undefined,
          departmentId: edit.departmentId ?? null,
          positionId: edit.positionId ?? null,
        };
        await onUpdate(user.id, body);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "create"
      ? "Thêm nhân viên"
      : mode === "edit"
        ? "Sửa nhân viên"
        : "Chi tiết nhân viên";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Đóng"
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-surface-900 shadow-glow animate-slide-up">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-surface-900/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-6">
          {mode === "create" && (
            <>
              <Field label="Username *">
                <input
                  className="input-field"
                  value={create.username}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, username: e.target.value }))
                  }
                  required
                  disabled={readOnly}
                />
              </Field>
              <Field label="Mật khẩu *">
                <input
                  type="password"
                  className="input-field"
                  value={create.password}
                  onChange={(e) =>
                    setCreate((c) => ({ ...c, password: e.target.value }))
                  }
                  required
                  disabled={readOnly}
                />
              </Field>
            </>
          )}

          {user && mode !== "create" && (
            <Field label="Username">
              <input className="input-field opacity-70" value={user.username} readOnly />
            </Field>
          )}

          <Field label="Họ và tên *">
            <input
              className="input-field"
              value={mode === "create" ? create.fullName : edit.fullName ?? ""}
              onChange={(e) =>
                mode === "create"
                  ? setCreate((c) => ({ ...c, fullName: e.target.value }))
                  : setEdit((x) => ({ ...x, fullName: e.target.value }))
              }
              required={mode === "create"}
              readOnly={readOnly}
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              className="input-field"
              value={mode === "create" ? create.email ?? "" : edit.email ?? ""}
              onChange={(e) =>
                mode === "create"
                  ? setCreate((c) => ({ ...c, email: e.target.value }))
                  : setEdit((x) => ({ ...x, email: e.target.value }))
              }
              readOnly={readOnly}
            />
          </Field>

          <Field label="Điện thoại">
            <input
              className="input-field font-mono text-sm"
              value={mode === "create" ? create.phone ?? "" : edit.phone ?? ""}
              onChange={(e) =>
                mode === "create"
                  ? setCreate((c) => ({ ...c, phone: e.target.value }))
                  : setEdit((x) => ({ ...x, phone: e.target.value }))
              }
              readOnly={readOnly}
            />
          </Field>

          <Field label="Địa chỉ">
            <input
              className="input-field"
              value={mode === "create" ? create.address ?? "" : edit.address ?? ""}
              onChange={(e) =>
                mode === "create"
                  ? setCreate((c) => ({ ...c, address: e.target.value }))
                  : setEdit((x) => ({ ...x, address: e.target.value }))
              }
              readOnly={readOnly}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Ngày sinh">
              <input
                type="date"
                className="input-field font-mono text-sm"
                value={
                  (mode === "create" ? create.dateOfBirth : edit.dateOfBirth)?.slice(
                    0,
                    10
                  ) ?? ""
                }
                onChange={(e) =>
                  mode === "create"
                    ? setCreate((c) => ({ ...c, dateOfBirth: e.target.value }))
                    : setEdit((x) => ({ ...x, dateOfBirth: e.target.value }))
                }
                readOnly={readOnly}
              />
            </Field>
            <Field label="Giới tính">
              <select
                className="input-field"
                value={mode === "create" ? create.gender ?? "" : edit.gender ?? ""}
                onChange={(e) =>
                  mode === "create"
                    ? setCreate((c) => ({ ...c, gender: e.target.value }))
                    : setEdit((x) => ({ ...x, gender: e.target.value }))
                }
                disabled={readOnly}
              >
                <option value="">—</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </Field>
          </div>

          <Field label="Vai trò *">
            <select
              className="input-field"
              value={
                mode === "create"
                  ? create.roleId || ""
                  : edit.roleId ?? user?.roleId ?? ""
              }
              onChange={(e) => {
                const v = Number(e.target.value);
                mode === "create"
                  ? setCreate((c) => ({ ...c, roleId: v }))
                  : setEdit((x) => ({ ...x, roleId: v }));
              }}
              required
              disabled={readOnly}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phòng ban">
              <select
                className="input-field"
                value={
                  mode === "create"
                    ? create.departmentId ?? ""
                    : edit.departmentId ?? ""
                }
                onChange={(e) => {
                  const v = e.target.value;
                  const num = v === "" ? null : Number(v);
                  mode === "create"
                    ? setCreate((c) => ({ ...c, departmentId: num }))
                    : setEdit((x) => ({ ...x, departmentId: num }));
                }}
                disabled={readOnly}
              >
                <option value="">— Không —</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Chức vụ">
              <select
                className="input-field"
                value={
                  mode === "create" ? create.positionId ?? "" : edit.positionId ?? ""
                }
                onChange={(e) => {
                  const v = e.target.value;
                  const num = v === "" ? null : Number(v);
                  mode === "create"
                    ? setCreate((c) => ({ ...c, positionId: num }))
                    : setEdit((x) => ({ ...x, positionId: num }));
                }}
                disabled={readOnly}
              >
                <option value="">— Không —</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {mode === "edit" && (
            <Field label="Trạng thái">
              <select
                className="input-field"
                value={edit.status ?? ""}
                onChange={(e) => setEdit((x) => ({ ...x, status: e.target.value }))}
                disabled={readOnly}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="LOCKED">LOCKED</option>
              </select>
            </Field>
          )}

          {user && mode === "view" && (
            <div className="rounded-xl border border-white/10 bg-surface-950/50 p-4 text-sm text-slate-400 space-y-1">
              <p>
                <span className="text-slate-500">Role:</span> {user.roleName}
              </p>
              <p>
                <span className="text-slate-500">Phòng ban:</span>{" "}
                {user.departmentName ?? "—"}
              </p>
              <p>
                <span className="text-slate-500">Chức vụ:</span>{" "}
                {user.positionName ?? "—"}
              </p>
              <p>
                <span className="text-slate-500">Tạo lúc:</span>{" "}
                {formatDateTime(user.createdAt)}
              </p>
              <p>
                <span className="text-slate-500">Cập nhật:</span>{" "}
                {formatDateTime(user.updatedAt)}
              </p>
            </div>
          )}

          {!readOnly && (
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" className="btn-ghost" onClick={onClose}>
                Hủy
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Đang lưu…" : mode === "create" ? "Tạo mới" : "Lưu thay đổi"}
              </button>
            </div>
          )}

          {readOnly && (
            <div className="flex justify-end pt-4 border-t border-white/10">
              <button type="button" className="btn-primary" onClick={onClose}>
                Đóng
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}
