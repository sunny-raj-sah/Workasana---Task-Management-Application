 import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("In Progress");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [projectsRes, tasksRes] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
      ]);

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.log("message:",error)
    } finally {
      setLoading(false);
    }
  };

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "Completed").length,
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    if (!filter) return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const recentTasks = filteredTasks.slice(0, 5);

  return (
    <Layout title="Dashboard"
    subtitle="Overview of projects, tasks and team activity">
      {loading ? (
        <div className="content-card text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <div className="text-muted">Loading dashboard...</div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="content-card h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small mb-2">Total Projects</div>
                    <h3 className="fw-bold mb-0">{projects.length}</h3>
                  </div>
                  <div className="rounded-4 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <i className="bi bi-folder-fill fs-4"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="content-card h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small mb-2">Total Tasks</div>
                    <h3 className="fw-bold mb-0">{tasks.length}</h3>
                  </div>
                  <div className="rounded-4 bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <i className="bi bi-list-task fs-4"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="content-card h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small mb-2">Completed</div>
                    <h3 className="fw-bold mb-0">{completedCount}</h3>
                  </div>
                  <div className="rounded-4 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <i className="bi bi-check-circle-fill fs-4"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="content-card h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small mb-2">Pending</div>
                    <h3 className="fw-bold mb-0">{tasks.length - completedCount}</h3>
                  </div>
                  <div className="rounded-4 bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <i className="bi bi-clock-fill fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
              <h5 className="mb-0 fw-bold">Recent Tasks</h5>

              <div className="filter-group">
                {['In Progress', 'Completed', 'Blocked'].map((status) => (
                  <button
                    key={status}
                    className={`filter-btn ${filter === status ? 'active' : ''}`}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {recentTasks.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-list-task display-4 text-muted"></i>
                <h6 className="mt-3 fw-bold">No tasks found</h6>
                <p className="text-muted mb-0">Create tasks to see them here.</p>
              </div>
            ) : (
              recentTasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                      <div className="fw-semibold fs-6">{task.name}</div>
                      <div className="text-muted small mt-1">
                        {task.project?.name} • {task.team?.name}
                      </div>
                    </div>

                    <span className={`badge ${
                      task.status === 'Completed'
                        ? 'bg-success'
                        : task.status === 'Blocked'
                        ? 'bg-danger'
                        : 'bg-primary'
                    } rounded-pill px-3 py-2`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {task.owners?.slice(0, 2).map((owner) => (
                        <div key={owner._id} className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: 12 }}>
                          {owner.name?.charAt(0).toUpperCase()}
                        </div>
                      ))}

                      <small className="text-muted">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                      </small>
                    </div>

                    <div className="text-muted small">
                      {task.timeToComplete} day{task.timeToComplete > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;