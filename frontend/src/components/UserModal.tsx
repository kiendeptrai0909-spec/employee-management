import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X, User, Briefcase, DollarSign, TrendingUp, Shield } from "lucide-react";
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
  identityCard: "",
  temporaryAddress: "",
  personalEmail: "",
  employeeCode: "",
  joinDate: "",
  contractType: "",
  managerId: null,
  basicSalary: null,
  allowance: null,
  bankAccountNumber: "",
  bankName: "",
  taxId: "",
  insuranceNumber: "",
  workSchedule: "",
  kpiScore: "",
  skills: "",
  educationLevel: "",
  equipment: "",
};

type TabId = "personal" | "work" | "finance" | "performance" | "system";

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "personal", label: "Cá nhân", icon: User },
  { id: "work", label: "Công việc", icon: Briefcase },
  { id: "finance", label: "Tài chính", icon: DollarSign },
  { id: "performance", label: "Đánh giá", icon: TrendingUp },
  { id: "system", label: "Hệ thống", icon: Shield },
];

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
  const [activeTab, setActiveTab] = useState<TabId>("personal");

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
        identityCard: user.identityCard ?? "",
        temporaryAddress: user.temporaryAddress ?? "",
        personalEmail: user.personalEmail ?? "",
        employeeCode: user.employeeCode ?? "",
        joinDate: user.joinDate ?? "",
        contractType: user.contractType ?? "",
        managerId: user.managerId,
        basicSalary: user.basicSalary,
        allowance: user.allowance,
        bankAccountNumber: user.bankAccountNumber ?? "",
        bankName: user.bankName ?? "",
        taxId: user.taxId ?? "",
        insuranceNumber: user.insuranceNumber ?? "",
        workSchedule: user.workSchedule ?? "",
        kpiScore: user.kpiScore ?? "",
        skills: user.skills ?? "",
        educationLevel: user.educationLevel ?? "",
        equipment: user.equipment ?? "",
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
        const body: UserCreateRequest = { ...create };
        Object.keys(body).forEach((key) => {
           if (typeof (body as any)[key] === 'string' && (body as any)[key] === '') {
               (body as any)[key] = undefined;
           }
        });
        await onCreate(body);
      } else if (mode === "edit" && user) {
        const body: UserUpdateRequest = { ...edit };
        Object.keys(body).forEach((key) => {
           if (typeof (body as any)[key] === 'string' && (body as any)[key] === '') {
               (body as any)[key] = undefined;
           }
        });
        await onUpdate(user.id, body);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const title = mode === "create" ? "Thêm nhân viên" : mode === "edit" ? "Sửa nhân viên" : "Chi tiết nhân viên";

  const val = (field: keyof UserCreateRequest & keyof UserUpdateRequest) => {
    if (mode === "create") return create[field] as any;
    return edit[field] as any;
  };

  const update = (field: keyof UserCreateRequest & keyof UserUpdateRequest, value: any) => {
    if (mode === "create") setCreate((c) => ({ ...c, [field]: value }));
    else setEdit((e) => ({ ...e, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Đóng" />
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-900 shadow-glow animate-slide-up">
        
        <div className="flex items-center justify-between border-b border-white/10 bg-surface-900/95 px-6 py-4 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-white/5 px-2 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition whitespace-nowrap ${
                  active ? "border-brand-500 text-brand-400" : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
            
            {/* 1. Cá nhân */}
            {activeTab === "personal" && (
              <div className="space-y-4 animate-fade-in">
                <Field label="Họ và tên *">
                  <input className="input-field" value={val("fullName") ?? ""} onChange={(e) => update("fullName", e.target.value)} required={mode === "create"} readOnly={readOnly} />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Ngày sinh">
                    <input type="date" className="input-field font-mono text-sm" value={val("dateOfBirth")?.slice(0, 10) ?? ""} onChange={(e) => update("dateOfBirth", e.target.value)} readOnly={readOnly} />
                  </Field>
                  <Field label="Giới tính">
                    <select className="input-field" value={val("gender") ?? ""} onChange={(e) => update("gender", e.target.value)} disabled={readOnly}>
                      <option value="">—</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Số CCCD/CMND">
                    <input className="input-field font-mono text-sm" value={val("identityCard") ?? ""} onChange={(e) => update("identityCard", e.target.value)} readOnly={readOnly} />
                  </Field>
                  <Field label="Điện thoại">
                    <input className="input-field font-mono text-sm" value={val("phone") ?? ""} onChange={(e) => update("phone", e.target.value)} readOnly={readOnly} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email cá nhân">
                    <input type="email" className="input-field" value={val("personalEmail") ?? ""} onChange={(e) => update("personalEmail", e.target.value)} readOnly={readOnly} />
                  </Field>
                  <Field label="Địa chỉ thường trú">
                    <input className="input-field" value={val("address") ?? ""} onChange={(e) => update("address", e.target.value)} readOnly={readOnly} />
                  </Field>
                </div>
                <Field label="Địa chỉ tạm trú">
                  <input className="input-field" value={val("temporaryAddress") ?? ""} onChange={(e) => update("temporaryAddress", e.target.value)} readOnly={readOnly} />
                </Field>
              </div>
            )}

            {/* 2. Công việc */}
            {activeTab === "work" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Mã nhân viên (ID)">
                    <input className="input-field font-mono" value={val("employeeCode") ?? ""} onChange={(e) => update("employeeCode", e.target.value)} readOnly={readOnly} placeholder="Ví dụ: NV001" />
                  </Field>
                  <Field label="Ngày bắt đầu làm việc">
                    <input type="date" className="input-field font-mono text-sm" value={val("joinDate")?.slice(0, 10) ?? ""} onChange={(e) => update("joinDate", e.target.value)} readOnly={readOnly} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Phòng ban">
                    <select className="input-field" value={val("departmentId") ?? ""} onChange={(e) => update("departmentId", e.target.value ? Number(e.target.value) : null)} disabled={readOnly}>
                      <option value="">— Không —</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Chức vụ">
                    <select className="input-field" value={val("positionId") ?? ""} onChange={(e) => update("positionId", e.target.value ? Number(e.target.value) : null)} disabled={readOnly}>
                      <option value="">— Không —</option>
                      {positions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Loại hợp đồng">
                    <select className="input-field" value={val("contractType") ?? ""} onChange={(e) => update("contractType", e.target.value)} disabled={readOnly}>
                      <option value="">— Không —</option>
                      <option value="PROBATION">Thử việc</option>
                      <option value="FULLTIME">Chính thức</option>
                      <option value="PARTTIME">Bán thời gian</option>
                      <option value="CONTRACT">Hợp đồng thời vụ</option>
                    </select>
                  </Field>
                  <Field label="Lịch làm việc">
                    <input className="input-field" value={val("workSchedule") ?? ""} onChange={(e) => update("workSchedule", e.target.value)} readOnly={readOnly} placeholder="VD: T2-T6, 8h-17h" />
                  </Field>
                </div>
              </div>
            )}

            {/* 3. Tài chính */}
            {activeTab === "finance" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Mức lương cơ bản (VNĐ)">
                    <input type="number" className="input-field font-mono" value={val("basicSalary") ?? ""} onChange={(e) => update("basicSalary", e.target.value ? Number(e.target.value) : null)} readOnly={readOnly} />
                  </Field>
                  <Field label="Phụ cấp (VNĐ)">
                    <input type="number" className="input-field font-mono" value={val("allowance") ?? ""} onChange={(e) => update("allowance", e.target.value ? Number(e.target.value) : null)} readOnly={readOnly} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Ngân hàng">
                    <input className="input-field" value={val("bankName") ?? ""} onChange={(e) => update("bankName", e.target.value)} readOnly={readOnly} placeholder="Tên ngân hàng + Chi nhánh" />
                  </Field>
                  <Field label="Số tài khoản">
                    <input className="input-field font-mono" value={val("bankAccountNumber") ?? ""} onChange={(e) => update("bankAccountNumber", e.target.value)} readOnly={readOnly} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Mã số thuế (MST)">
                    <input className="input-field font-mono" value={val("taxId") ?? ""} onChange={(e) => update("taxId", e.target.value)} readOnly={readOnly} />
                  </Field>
                  <Field label="Mã sổ BHXH/BHYT">
                    <input className="input-field font-mono" value={val("insuranceNumber") ?? ""} onChange={(e) => update("insuranceNumber", e.target.value)} readOnly={readOnly} />
                  </Field>
                </div>
              </div>
            )}

            {/* 4. Đánh giá */}
            {activeTab === "performance" && (
              <div className="space-y-4 animate-fade-in">
                <Field label="Trình độ học vấn">
                  <input className="input-field" value={val("educationLevel") ?? ""} onChange={(e) => update("educationLevel", e.target.value)} readOnly={readOnly} placeholder="VD: Cử nhân CNTT" />
                </Field>
                <Field label="Kỹ năng chuyên môn">
                  <textarea className="input-field min-h-[80px] resize-y" value={val("skills") ?? ""} onChange={(e) => update("skills", e.target.value)} readOnly={readOnly} placeholder="Liệt kê các kỹ năng..." />
                </Field>
                <Field label="Kết quả đánh giá KPI">
                  <input className="input-field" value={val("kpiScore") ?? ""} onChange={(e) => update("kpiScore", e.target.value)} readOnly={readOnly} placeholder="VD: Hoàn thành tốt (A)" />
                </Field>
              </div>
            )}

            {/* 5. Hệ thống */}
            {activeTab === "system" && (
              <div className="space-y-4 animate-fade-in">
                {mode === "create" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Username đăng nhập *">
                      <input className="input-field" value={create.username} onChange={(e) => setCreate((c) => ({ ...c, username: e.target.value }))} required disabled={readOnly} />
                    </Field>
                    <Field label="Mật khẩu khởi tạo *">
                      <input type="password" className="input-field" value={create.password} onChange={(e) => setCreate((c) => ({ ...c, password: e.target.value }))} required disabled={readOnly} />
                    </Field>
                  </div>
                )}
                {user && mode !== "create" && (
                  <Field label="Username đăng nhập">
                    <input className="input-field opacity-70" value={user.username} readOnly />
                  </Field>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email công ty (Email hệ thống)">
                    <input type="email" className="input-field" value={val("email") ?? ""} onChange={(e) => update("email", e.target.value)} readOnly={readOnly} />
                  </Field>
                  <Field label="Vai trò (Role) *">
                    <select className="input-field" value={val("roleId") || ""} onChange={(e) => update("roleId", Number(e.target.value))} required disabled={readOnly}>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                
                <Field label="Thiết bị được cấp phát">
                  <textarea className="input-field min-h-[80px] resize-y" value={val("equipment") ?? ""} onChange={(e) => update("equipment", e.target.value)} readOnly={readOnly} placeholder="VD: Macbook Pro M1, Chuột..." />
                </Field>

                {mode === "edit" && (
                  <Field label="Trạng thái tài khoản">
                    <select className="input-field" value={edit.status ?? ""} onChange={(e) => setEdit((x) => ({ ...x, status: e.target.value }))} disabled={readOnly}>
                      <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                      <option value="INACTIVE">Tạm khóa (INACTIVE)</option>
                      <option value="LOCKED">Đã nghỉ việc (LOCKED)</option>
                    </select>
                  </Field>
                )}

                {user && mode === "view" && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-surface-950/50 p-4 text-sm text-slate-400 space-y-1">
                    <p><span className="text-slate-500">Tạo lúc:</span> {formatDateTime(user.createdAt)}</p>
                    <p><span className="text-slate-500">Cập nhật:</span> {formatDateTime(user.updatedAt)}</p>
                  </div>
                )}
              </div>
            )}
            
          </div>

          <div className="border-t border-white/10 bg-surface-900/50 px-6 py-4">
            {!readOnly ? (
              <div className="flex justify-end gap-3">
                <button type="button" className="btn-ghost" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Đang lưu…" : mode === "create" ? "Tạo nhân viên" : "Lưu thay đổi"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button type="button" className="btn-primary" onClick={onClose}>Đóng</button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}
