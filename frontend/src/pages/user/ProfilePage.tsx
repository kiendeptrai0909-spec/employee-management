import { useEffect, useState } from "react";
import { unwrapApiData } from "../../services/api";
import { getMyProfile, updateMyProfile } from "../../services/userService";
import { getCurrentUser } from "../../utils/authStorage";

interface ProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    avatar: "",
  });

  const loadData = async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const response = await getMyProfile(currentUser.id);
      const data = unwrapApiData(response) as ProfileData;
      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth || "",
        gender: data.gender || "",
        avatar: data.avatar || "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      await updateMyProfile(currentUser.id, {
        fullName: form.fullName,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        avatar: form.avatar || null,
      });
      await loadData();
      window.alert("Cập nhật profile thành công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="app-page-title">Hồ sơ cá nhân</h1>
      <p className="app-page-sub">Cập nhật thông tin liên hệ và cá nhân</p>
      <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="h5 fw-semibold mb-4">Thông tin</h2>
        <form className="row g-3" onSubmit={(e) => void handleSubmit(e)}>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-secondary">Họ tên</label>
            <input
              className="form-control"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-secondary">Email</label>
            <input
              className="form-control"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-secondary">Điện thoại</label>
            <input
              className="form-control"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-secondary">Địa chỉ</label>
            <input
              className="form-control"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold text-secondary">Ngày sinh</label>
            <input
              type="date"
              className="form-control"
              value={form.dateOfBirth}
              onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold text-secondary">Giới tính</label>
            <input
              className="form-control"
              value={form.gender}
              onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold text-secondary">Ảnh đại diện (URL)</label>
            <input
              className="form-control"
              value={form.avatar}
              onChange={(e) => setForm((prev) => ({ ...prev, avatar: e.target.value }))}
            />
          </div>
          <div className="col-12 pt-2">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={loading}
            >
              {loading ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
