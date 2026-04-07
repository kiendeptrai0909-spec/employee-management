import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, User } from "lucide-react";
import { login } from "../api/authApi";
import { ApiError } from "../api/client";
import { useToast } from "../context/ToastContext";
import type { SessionUser } from "../components/Layout";

const STORAGE_KEY = "es_session";

export function readSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function writeSession(user: SessionUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

interface LoginPageProps {
  onLoggedIn: (user: SessionUser) => void;
}

export function LoginPage({ onLoggedIn }: LoginPageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ username, password });
      const u = res.data;
      const session: SessionUser = {
        username: u.username,
        fullName: u.fullName,
        roleName: u.roleName,
      };
      writeSession(session);
      onLoggedIn(session);
      toast.push(`Chào ${u.fullName}!`, "success");
      navigate("/employees");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Đăng nhập thất bại. Thử lại.";
      toast.push(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <div className="rounded-3xl border border-white/10 bg-surface-900/60 p-8 shadow-glow backdrop-blur-xl sm:p-10">
        <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-500">
          Dùng tài khoản có trong CSDL MySQL (username / password plain text theo backend
          demo).
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                className="input-field pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder="admin"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Mật khẩu
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                className="input-field pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
