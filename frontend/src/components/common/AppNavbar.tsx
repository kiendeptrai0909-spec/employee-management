import { useNavigate } from "react-router-dom";
import { clearCurrentUser, getCurrentUser } from "../../utils/authStorage";

export default function AppNavbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container-fluid px-3 px-lg-4">
        <div className="d-flex align-items-center gap-2">
          <span className="app-brand-mark" aria-hidden>
            ES
          </span>
          <div>
            <span className="navbar-brand mb-0">Employee System</span>
            <div className="d-none d-sm-block small text-muted lh-1" style={{ fontSize: "0.75rem" }}>
              Quản lý nhân sự
            </div>
          </div>
        </div>
        <div className="ms-auto d-flex align-items-center gap-2 gap-sm-3">
          {user && (
            <span className="app-user-pill d-none d-md-inline">
              <strong>{user.fullName}</strong>
              <span className="text-muted"> · </span>
              {user.role}
            </span>
          )}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill px-3"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}
