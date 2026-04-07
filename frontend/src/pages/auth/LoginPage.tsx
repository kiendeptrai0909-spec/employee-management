import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../services/authService";
import { saveCurrentUser } from "../../utils/authStorage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ username, password });
      const user = response.data?.data;
      const role = user?.role || user?.roleName;
      if (!user || !role) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ.");
      }

      saveCurrentUser({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role,
        email: user.email,
      });

      if (role === "ADMIN") navigate("/admin");
      else navigate("/user");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Đăng nhập thất bại.");
      } else {
        setError("Đăng nhập thất bại. Kiểm tra lại tài khoản/mật khẩu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="card-body">
          <div className="text-center">
            <div className="login-brand mx-auto">ES</div>
            <h1 className="text-center">Đăng nhập</h1>
            <p className="lead text-center">Hệ thống quản lý nhân sự</p>
          </div>
          {error && (
            <div className="alert alert-danger border-0 py-2 small mb-3" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Tên đăng nhập</label>
              <input
                className="form-control"
                placeholder="Nhập username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
