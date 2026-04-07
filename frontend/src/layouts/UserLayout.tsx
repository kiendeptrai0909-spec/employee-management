import { Outlet } from "react-router-dom";
import AppNavbar from "../components/common/AppNavbar";
import AppSidebar from "../components/common/AppSidebar";

export default function UserLayout() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <div className="row g-0 app-layout-row">
        <div className="col-md-3 col-lg-2 app-sidebar-wrap px-0">
          <AppSidebar role="USER" />
        </div>
        <div className="col-md-9 col-lg-10 app-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
