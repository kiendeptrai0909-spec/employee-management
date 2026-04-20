import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { X, User, Briefcase, DollarSign, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
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

const TABS: { id: TabId; label: string; icon: any; desc: string }[] = [
  { id: "personal", label: "Cá nhân", icon: User, desc: "Thông tin cơ bản" },
  { id: "work", label: "Công việc", icon: Briefcase, desc: "Phòng ban, chức vụ" },
  { id: "finance", label: "Tài chính", icon: DollarSign, desc: "Lương, thuế, BHXH" },
  { id: "performance", label: "Đánh giá", icon: TrendingUp, desc: "Kỹ năng, KPI" },
  { id: "system", label: "Hệ thống", icon: Shield, desc: "Tài khoản & Phân quyền" },
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

  const title = mode === "create" ? "Thêm nhân sự mới" : mode === "edit" ? "Cập nhật hồ sơ" : "Chi tiết hồ sơ nhân sự";
  const subtitle = mode === "create" ? "Điền đầy đủ thông tin để tạo hồ sơ nhân viên" : "Quản lý và cập nhật thông tin cá nhân";

  const val = (field: keyof UserCreateRequest & keyof UserUpdateRequest) => {
    if (mode === "create") return create[field] as any;
    return edit[field] as any;
  };

  const update = (field: keyof UserCreateRequest & keyof UserUpdateRequest, value: any) => {
    if (mode === "create") setCreate((c) => ({ ...c, [field]: value }));
    else setEdit((e) => ({ ...e, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4 sm:p-6">
      {/* Backdrop */}
      <button 
        type="button" 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
        aria-label="Đóng" 
      />
      
      {/* Modal Container */}
      <div className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-surface-950/90 shadow-[0_0_80px_-20px_rgba(99,102,241,0.2)] backdrop-blur-2xl animate-slide-up">
        
        {/* Header - Glassmorphism */}
        <div className="relative flex items-start justify-between border-b border-white/10 bg-white/[0.02] px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-transparent opacity-50" />
          <div className="relative">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="relative rounded-full bg-white/5 p-2.5 text-slate-400 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
          {/* Sidebar Tabs */}
          <div className="flex w-full shrink-0 flex-row overflow-x-auto border-b border-white/5 bg-black/20 p-4 sm:w-64 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r custom-scrollbar">
            <div className="flex sm:flex-col gap-2 min-w-max sm:min-w-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-300 ${
                      active 
                        ? "bg-gradient-to-r from-brand-500/20 to-brand-500/5 text-brand-400 shadow-[inset_2px_0_0_0_rgba(99,102,241,0.5)]" 
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <div className={`rounded-xl p-2.5 transition-colors duration-300 ${active ? "bg-brand-500/20" : "bg-white/5 group-hover:bg-white/10"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-semibold text-sm">{tab.label}</p>
                      <p className={`text-[11px] mt-0.5 ${active ? "text-brand-400/70" : "text-slate-500"}`}>{tab.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={submit} className="flex flex-1 flex-col overflow-hidden bg-black/10">
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar relative">
              <div className="mx-auto max-w-2xl">
                
                {/* 1. Cá nhân */}
                <div className={`space-y-6 transition-all duration-500 ${activeTab === "personal" ? "opacity-100 translate-x-0 block" : "opacity-0 translate-x-4 hidden"}`}>
                  <Field label="Họ và tên *" required>
                    <input className="input-field-premium" value={val("fullName") ?? ""} onChange={(e) => update("fullName", e.target.value)} required={mode === "create"} readOnly={readOnly} placeholder="Nhập họ và tên đầy đủ" />
                  </Field>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Ngày sinh">
                      <input type="date" className="input-field-premium font-mono" value={val("dateOfBirth")?.slice(0, 10) ?? ""} onChange={(e) => update("dateOfBirth", e.target.value)} readOnly={readOnly} />
                    </Field>
                    <Field label="Giới tính">
                      <select className="input-field-premium" value={val("gender") ?? ""} onChange={(e) => update("gender", e.target.value)} disabled={readOnly}>
                        <option value="">— Chọn giới tính —</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Số CCCD/CMND">
                      <input className="input-field-premium font-mono" value={val("identityCard") ?? ""} onChange={(e) => update("identityCard", e.target.value)} readOnly={readOnly} placeholder="12 chữ số" />
                    </Field>
                    <Field label="Điện thoại">
                      <input className="input-field-premium font-mono" value={val("phone") ?? ""} onChange={(e) => update("phone", e.target.value)} readOnly={readOnly} placeholder="Số điện thoại liên hệ" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Email cá nhân">
                      <input type="email" className="input-field-premium" value={val("personalEmail") ?? ""} onChange={(e) => update("personalEmail", e.target.value)} readOnly={readOnly} placeholder="example@gmail.com" />
                    </Field>
                    <Field label="Địa chỉ thường trú">
                      <input className="input-field-premium" value={val("address") ?? ""} onChange={(e) => update("address", e.target.value)} readOnly={readOnly} placeholder="Địa chỉ trên sổ hộ khẩu" />
                    </Field>
                  </div>
                  <Field label="Địa chỉ tạm trú">
                    <input className="input-field-premium" value={val("temporaryAddress") ?? ""} onChange={(e) => update("temporaryAddress", e.target.value)} readOnly={readOnly} placeholder="Nơi ở hiện tại" />
                  </Field>
                </div>

                {/* 2. Công việc */}
                <div className={`space-y-6 transition-all duration-500 ${activeTab === "work" ? "opacity-100 translate-x-0 block" : "opacity-0 translate-x-4 hidden"}`}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Mã nhân viên (ID)">
                      <input className="input-field-premium font-mono text-brand-400" value={val("employeeCode") ?? ""} onChange={(e) => update("employeeCode", e.target.value)} readOnly={readOnly} placeholder="Ví dụ: NV001" />
                    </Field>
                    <Field label="Ngày bắt đầu làm việc">
                      <input type="date" className="input-field-premium font-mono" value={val("joinDate")?.slice(0, 10) ?? ""} onChange={(e) => update("joinDate", e.target.value)} readOnly={readOnly} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Phòng ban">
                      <select className="input-field-premium" value={val("departmentId") ?? ""} onChange={(e) => update("departmentId", e.target.value ? Number(e.target.value) : null)} disabled={readOnly}>
                        <option value="">— Chưa xếp phòng —</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Chức vụ">
                      <select className="input-field-premium" value={val("positionId") ?? ""} onChange={(e) => update("positionId", e.target.value ? Number(e.target.value) : null)} disabled={readOnly}>
                        <option value="">— Chưa xếp chức vụ —</option>
                        {positions.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Loại hợp đồng">
                      <select className="input-field-premium" value={val("contractType") ?? ""} onChange={(e) => update("contractType", e.target.value)} disabled={readOnly}>
                        <option value="">— Chưa rõ —</option>
                        <option value="PROBATION">Thử việc</option>
                        <option value="FULLTIME">Chính thức</option>
                        <option value="PARTTIME">Bán thời gian</option>
                        <option value="CONTRACT">Hợp đồng thời vụ</option>
                      </select>
                    </Field>
                    <Field label="Lịch làm việc">
                      <input className="input-field-premium" value={val("workSchedule") ?? ""} onChange={(e) => update("workSchedule", e.target.value)} readOnly={readOnly} placeholder="VD: T2-T6, 8h-17h" />
                    </Field>
                  </div>
                </div>

                {/* 3. Tài chính */}
                <div className={`space-y-6 transition-all duration-500 ${activeTab === "finance" ? "opacity-100 translate-x-0 block" : "opacity-0 translate-x-4 hidden"}`}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Mức lương cơ bản (VNĐ)">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₫</span>
                        <input type="number" className="input-field-premium pl-8 font-mono text-emerald-400" value={val("basicSalary") ?? ""} onChange={(e) => update("basicSalary", e.target.value ? Number(e.target.value) : null)} readOnly={readOnly} placeholder="0" />
                      </div>
                    </Field>
                    <Field label="Phụ cấp (VNĐ)">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₫</span>
                        <input type="number" className="input-field-premium pl-8 font-mono" value={val("allowance") ?? ""} onChange={(e) => update("allowance", e.target.value ? Number(e.target.value) : null)} readOnly={readOnly} placeholder="0" />
                      </div>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Ngân hàng">
                      <input className="input-field-premium" value={val("bankName") ?? ""} onChange={(e) => update("bankName", e.target.value)} readOnly={readOnly} placeholder="Tên ngân hàng + Chi nhánh" />
                    </Field>
                    <Field label="Số tài khoản">
                      <input className="input-field-premium font-mono tracking-wider" value={val("bankAccountNumber") ?? ""} onChange={(e) => update("bankAccountNumber", e.target.value)} readOnly={readOnly} placeholder="Nhập số tài khoản" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Mã số thuế cá nhân">
                      <input className="input-field-premium font-mono" value={val("taxId") ?? ""} onChange={(e) => update("taxId", e.target.value)} readOnly={readOnly} placeholder="Nhập MST" />
                    </Field>
                    <Field label="Mã sổ BHXH/BHYT">
                      <input className="input-field-premium font-mono" value={val("insuranceNumber") ?? ""} onChange={(e) => update("insuranceNumber", e.target.value)} readOnly={readOnly} placeholder="Nhập mã sổ" />
                    </Field>
                  </div>
                </div>

                {/* 4. Đánh giá */}
                <div className={`space-y-6 transition-all duration-500 ${activeTab === "performance" ? "opacity-100 translate-x-0 block" : "opacity-0 translate-x-4 hidden"}`}>
                  <Field label="Trình độ học vấn">
                    <input className="input-field-premium" value={val("educationLevel") ?? ""} onChange={(e) => update("educationLevel", e.target.value)} readOnly={readOnly} placeholder="VD: Cử nhân CNTT" />
                  </Field>
                  <Field label="Kỹ năng chuyên môn">
                    <textarea className="input-field-premium min-h-[120px] resize-y" value={val("skills") ?? ""} onChange={(e) => update("skills", e.target.value)} readOnly={readOnly} placeholder="Liệt kê các kỹ năng quan trọng..." />
                  </Field>
                  <Field label="Kết quả đánh giá KPI (Kỳ gần nhất)">
                    <input className="input-field-premium" value={val("kpiScore") ?? ""} onChange={(e) => update("kpiScore", e.target.value)} readOnly={readOnly} placeholder="VD: Hoàn thành xuất sắc (A+)" />
                  </Field>
                </div>

                {/* 5. Hệ thống */}
                <div className={`space-y-6 transition-all duration-500 ${activeTab === "system" ? "opacity-100 translate-x-0 block" : "opacity-0 translate-x-4 hidden"}`}>
                  {mode === "create" && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 p-5 rounded-2xl bg-brand-500/5 border border-brand-500/10">
                      <Field label="Username đăng nhập *" required>
                        <input className="input-field-premium bg-surface-900/50" value={create.username} onChange={(e) => setCreate((c) => ({ ...c, username: e.target.value }))} required disabled={readOnly} placeholder="Tên đăng nhập" />
                      </Field>
                      <Field label="Mật khẩu khởi tạo *" required>
                        <input type="password" className="input-field-premium bg-surface-900/50" value={create.password} onChange={(e) => setCreate((c) => ({ ...c, password: e.target.value }))} required disabled={readOnly} placeholder="••••••••" />
                      </Field>
                    </div>
                  )}
                  {user && mode !== "create" && (
                    <Field label="Username đăng nhập">
                      <input className="input-field-premium opacity-50 cursor-not-allowed bg-black/20" value={user.username} readOnly />
                    </Field>
                  )}

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Email hệ thống (Công việc)">
                      <input type="email" className="input-field-premium" value={val("email") ?? ""} onChange={(e) => update("email", e.target.value)} readOnly={readOnly} placeholder="Tài khoản email nội bộ" />
                    </Field>
                    <Field label="Vai trò (Role) *" required>
                      <select className="input-field-premium text-brand-400 font-semibold" value={val("roleId") || ""} onChange={(e) => update("roleId", Number(e.target.value))} required disabled={readOnly}>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  
                  <Field label="Thiết bị được cấp phát">
                    <textarea className="input-field-premium min-h-[100px] resize-y" value={val("equipment") ?? ""} onChange={(e) => update("equipment", e.target.value)} readOnly={readOnly} placeholder="Tài sản công ty cấp phát (Macbook, Màn hình, Chuột...)" />
                  </Field>

                  {mode === "edit" && (
                    <Field label="Trạng thái tài khoản">
                      <select className="input-field-premium bg-surface-950 border-white/5" value={edit.status ?? ""} onChange={(e) => setEdit((x) => ({ ...x, status: e.target.value }))} disabled={readOnly}>
                        <option value="ACTIVE">🟢 Hoạt động (ACTIVE)</option>
                        <option value="INACTIVE">🟡 Tạm khóa (INACTIVE)</option>
                        <option value="LOCKED">🔴 Đã nghỉ việc (LOCKED)</option>
                      </select>
                    </Field>
                  )}

                  {user && mode === "view" && (
                    <div className="mt-4 flex gap-6 rounded-2xl border border-white/5 bg-black/20 p-5 text-sm text-slate-400">
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Tạo lúc</span>
                        <span className="font-mono text-slate-300">{formatDateTime(user.createdAt)}</span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Cập nhật lần cuối</span>
                        <span className="font-mono text-slate-300">{formatDateTime(user.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 bg-black/20 px-6 py-5 sm:px-8">
              {!readOnly ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 hidden sm:block">
                    Vui lòng kiểm tra kỹ thông tin trước khi lưu.
                  </p>
                  <div className="flex w-full sm:w-auto justify-end gap-3">
                    <button type="button" className="btn-ghost px-6 py-2.5 rounded-xl font-medium" onClick={onClose}>Hủy bỏ</button>
                    <button 
                      type="submit" 
                      className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-8 py-2.5 font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 disabled:pointer-events-none disabled:opacity-50" 
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <>
                          <span>{mode === "create" ? "Tạo nhân viên" : "Lưu thay đổi"}</span>
                          <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <button type="button" className="btn-primary px-8 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-brand-500/25" onClick={onClose}>Đóng</button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="group">
      <label className="mb-2 block text-sm font-medium text-slate-400 group-focus-within:text-brand-400 transition-colors">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

