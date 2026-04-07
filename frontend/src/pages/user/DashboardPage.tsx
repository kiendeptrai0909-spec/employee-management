import { getCurrentUser } from "../../utils/authStorage";

export default function UserDashboardPage() {
  const user = getCurrentUser();

  return (
    <div>
      <h1 className="app-page-title">Xin chào{user?.fullName ? `, ${user.fullName}` : ""}</h1>
      <p className="app-page-sub">Bạn đang đăng nhập với vai trò nhân viên.</p>

      <div className="card">
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white fw-bold"
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                fontSize: "1.25rem",
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="h5 mb-1 fw-semibold">{user?.fullName ?? "User"}</h2>
              <p className="text-muted small mb-0">
                {user?.username} · {user?.role}
              </p>
            </div>
          </div>
          <p className="text-muted mt-3 mb-0 small">
            Dùng menu bên trái để xem và cập nhật hồ sơ cá nhân.
          </p>
        </div>
      </div>
    </div>
  );
}
