 import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import api from "../services/api";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);

      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
      ]);

      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error("Failed to load project");
      console.log("message:",error)
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleStatusChange = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const filteredTasks = statusFilter
    ? tasks.filter((task) => task.status === statusFilter)
    : tasks;

  if (loading) {
    return (
      <Layout title="Project Details">
        <div className="content-card text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <div className="text-muted">Loading project...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={project?.name || "Project Details"}>
      <div className="content-card mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">
          <div>
            <h4 className="fw-bold mb-2">{project?.name}</h4>
            <p className="text-muted mb-3">
              {project?.description || "No description available"}
            </p>

            <div className="d-flex gap-4 flex-wrap text-muted small">
              <span>
                <i className="bi bi-list-task me-1"></i>
                {tasks.length} Tasks
              </span>
              <span>
                <i className="bi bi-check-circle me-1"></i>
                {tasks.filter((t) => t.status === "Completed").length} Completed
              </span>
            </div>
          </div>

          <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>
            Add Task
          </button>
        </div>
      </div>

      <div className="content-card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="filter-group">
            <button
              className={`filter-btn ${statusFilter === "" ? "active" : ""}`}
              onClick={() => setStatusFilter("")}
            >
              All
            </button>

            <button
              className={`filter-btn ${statusFilter === "To Do" ? "active" : ""}`}
              onClick={() => setStatusFilter("To Do")}
            >
              To Do
            </button>

            <button
              className={`filter-btn ${statusFilter === "In Progress" ? "active" : ""}`}
              onClick={() => setStatusFilter("In Progress")}
            >
              In Progress
            </button>

            <button
              className={`filter-btn ${statusFilter === "Completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("Completed")}
            >
              Completed
            </button>

            <button
              className={`filter-btn ${statusFilter === "Blocked" ? "active" : ""}`}
              onClick={() => setStatusFilter("Blocked")}
            >
              Blocked
            </button>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">Project Tasks</h5>
          <span className="text-muted">{filteredTasks.length} tasks</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-list-task display-4 text-muted"></i>
            <h6 className="mt-3 fw-bold">No tasks found</h6>
            <p className="text-muted">Create the first task for this project.</p>
            <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(true)}>
              Create Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      <CreateTaskModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        projectId={id}
        onTaskCreated={handleTaskCreated}
      />
    </Layout>
  );
};

export default ProjectDetails;