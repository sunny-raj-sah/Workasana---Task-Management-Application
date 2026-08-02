import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-kanban-fill me-2"></i>
        <span>Workasana</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="sidebar-link">
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/projects" className="sidebar-link">
          <i className="bi bi-folder-fill"></i>
          <span>Projects</span>
        </NavLink>

        <NavLink to="/teams" className="sidebar-link">
          <i className="bi bi-people-fill"></i>
          <span>Teams</span>
        </NavLink>

        <NavLink to="/reports" className="sidebar-link">
          <i className="bi bi-bar-chart-fill"></i>
          <span>Reports</span>
        </NavLink>

        <NavLink to="/settings" className="sidebar-link">
          <i className="bi bi-gear-fill"></i>
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;