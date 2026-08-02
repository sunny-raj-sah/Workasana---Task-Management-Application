 import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({
  title,
  subtitle,
  children,
  showAddButton = false,
  addButtonText = "+ Add Task",
  onAddClick,
}) => {
  const { state } = useAuth();

  const user = state?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            <div className="text-muted">
              {subtitle || "Manage your workspace efficiently"}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {showAddButton && (
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={onAddClick}
              >
                {addButtonText}
              </button>
            )}

            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold"
                style={{ width: 40, height: 40 }}
              >
                {initials}
              </div>

              <div className="d-none d-md-block">
                <div className="fw-semibold">{user?.name || "Guest User"}</div>
                <small className="text-muted">
                  {user?.role || "Workspace Member"}
                </small>
              </div>
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export default Layout;