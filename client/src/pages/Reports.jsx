import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

const Reports = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [projectsRes, tasksRes] = await Promise.all([
        api.get("/projects"),
        api.get("/tasks"),
      ]);

      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error("Failed to load reports");
      console.log("message:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do").length;
    const blocked = tasks.filter((t) => t.status === "Blocked").length;

    return {
      completed,
      inProgress,
      todo,
      blocked,
      completionRate: tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0,
    };
  }, [tasks]);

  const pieData = {
    labels: ["Completed", "In Progress", "To Do", "Blocked"],
    datasets: [
      {
        data: [stats.completed, stats.inProgress, stats.todo, stats.blocked],
        backgroundColor: ["#198754", "#0d6efd", "#6c757d", "#dc3545"],
        borderWidth: 0,
      },
    ],
  };

  const tasksByTeam = useMemo(() => {
    const map = {};

    tasks.forEach((task) => {
      const teamName = task.team?.name || "Unknown";
      map[teamName] = (map[teamName] || 0) + 1;
    });

    return map;
  }, [tasks]);

  const barData = {
    labels: Object.keys(tasksByTeam),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(tasksByTeam),
        backgroundColor: "#0d6efd",
        borderRadius: 8,
      },
    ],
  };

  if (loading) {
    return (
      <Layout title="Reports">
        <div className="content-card text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <div className="text-muted">Loading reports...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reports"
    subtitle="Track progress and performance">
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="content-card h-100">
            <div className="text-muted small mb-2">Projects</div>
            <h3 className="fw-bold mb-0">{projects.length}</h3>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="content-card h-100">
            <div className="text-muted small mb-2">Tasks</div>
            <h3 className="fw-bold mb-0">{tasks.length}</h3>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="content-card h-100">
            <div className="text-muted small mb-2">Completed</div>
            <h3 className="fw-bold mb-0 text-success">{stats.completed}</h3>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <div className="content-card h-100">
            <div className="text-muted small mb-2">Completion Rate</div>
            <h3 className="fw-bold mb-0 text-primary">
              {stats.completionRate}%
            </h3>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-5">
          <div className="content-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Tasks by Status</h5>
              <i className="bi bi-pie-chart text-muted"></i>
            </div>  
            <div className="d-flex justify-content-center align-items-center p-3">
              <div style={{ width: "100%", maxWidth: 320 }}>
                <Pie data={pieData} />
              </div>
            </div>
          </div>
        </div>
          
         <div className="col-12 col-lg-7">
  <div className="content-card h-100">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold mb-0">Tasks by Team</h5>
      <i className="bi bi-bar-chart text-muted"></i>
    </div>
             {/* FIXED HEIGHT CONTAINER */}
    <div style={{ height: "320px", position: "relative" }}>
      <Bar
        data={barData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 },
              grid: { color: "rgba(0,0,0,0.05)" },
            },
            x: {
              grid: { display: false },
            },
          },
        }}
      />
    </div>
  </div>
</div>
 </div>
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Recent Activity</h5>
          <span className="text-muted small">Latest 5 tasks</span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-activity display-4 text-muted"></i>
            <p className="text-muted mt-3 mb-0">No activity available</p>
          </div>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <div
              key={task._id}
              className="d-flex justify-content-between align-items-center py-3 border-bottom"
            >
              <div>
                <div className="fw-semibold">{task.name}</div>
                <div className="text-muted small">
                  {task.project?.name} • {task.team?.name}
                </div>
              </div>

              <span
                className={`badge ${
                  task.status === "Completed"
                    ? "bg-success"
                    : task.status === "Blocked"
                      ? "bg-danger"
                      : task.status === "In Progress"
                        ? "bg-primary"
                        : "bg-secondary"
                } rounded-pill px-3 py-2`}
              >
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Reports;
