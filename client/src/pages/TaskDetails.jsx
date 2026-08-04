 import { useEffect, useState} from "react";
import { useParams,useNavigate ,Link } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import EditTaskModal from "../components/EditTaskModal";

const TaskDetails = () => {
  const { id } = useParams();
const navigate = useNavigate();


  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadTask();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/tasks/${id}`);
// console.log("Task data:", data);
      setTask(data);
    } catch (error) {
      toast.error("Failed to load task");
      console.log("message:",error)
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    try {
      const { data } = await api.patch(`/tasks/${id}/status`, {
        status: "Completed",
      });

      setTask(data);
      toast.success("Task marked as completed");
    } catch (error) {
      toast.error("Failed to update task");
      console.log("message:",error)
    }
    
  };
  const deleteTask = async () => {
  try {
     const projectId = task.project._id;
    await api.delete(`/tasks/${id}`);

    toast.success("Task deleted successfully");
    navigate(`/projects/${projectId}`);
  } catch (error) {
    toast.error("Failed to delete task");
    console.log("message:", error);
  }
};

  const handleTaskUpdated = (updatedTask) => { setTask(updatedTask); };

  const getRemainingDays = () => {
    if (!task?.dueDate) return null;

    const due = new Date(task.dueDate);
    const today = new Date();
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    return diff;
  };

  const remainingDays = getRemainingDays();

  if (loading) {
    return (
      <Layout title="Task Details">
        <div className="content-card text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <div className="text-muted">Loading task...</div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout title="Task Details">
        <div className="content-card text-center py-5">
          <i className="bi bi-exclamation-circle display-4 text-muted"></i>
          <h5 className="mt-3 fw-bold">Task not found</h5>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Task Details">
      <div className="content-card mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <Link
              to={`/projects/${task.project?._id}`}
              className="btn btn-light btn-sm rounded-pill mb-3"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Project
            </Link>

            <h3 className="fw-bold mb-2">{task.name}</h3>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {task.tags?.map((tag) => (
                <span key={tag} className="badge bg-light text-dark border rounded-pill px-3 py-2">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="text-end">
            <span className={`badge ${
              task.status === "Completed"
                ? "bg-success"
                : task.status === "Blocked"
                ? "bg-danger"
                : task.status === "In Progress"
                ? "bg-primary"
                : "bg-secondary"
            } rounded-pill px-4 py-2 fs-6`}
            >
              {task.status}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="content-card h-100">
            <h5 className="fw-bold mb-4">Task Information</h5>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="text-muted small mb-1">Project</div>
                <div className="fw-semibold">{task.project?.name}</div>
              </div>

              <div className="col-md-6">
                <div className="text-muted small mb-1">Team</div>
                <div className="fw-semibold">{task.team?.name}</div>
              </div>

              <div className="col-md-6">
                <div className="text-muted small mb-1">Due Date</div>
                <div className="fw-semibold">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </div>
              </div>

              <div className="col-md-6">
                <div className="text-muted small mb-1">Estimated Time</div>
                <div className="fw-semibold">
                  {task.timeToComplete} day{task.timeToComplete > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <div className="text-muted small mb-3">Owners</div>

              <div className="d-flex flex-wrap gap-3">
                {task.owners?.map((owner) => (
                  <div key={owner._id} className="d-flex align-items-center gap-3 p-3 border rounded-4 min-width-0">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 44, height: 44 }}>
                      {owner.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-width-0">
                      <div className="fw-semibold text-truncate">{owner.name}</div>
                      <div className="text-muted small text-truncate">{owner.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="content-card h-100">
            <h5 className="fw-bold mb-4">Status & Progress</h5>

            <div className="text-center mb-4">
              <div className="display-4 fw-bold text-primary">
                {remainingDays === null ? "∞" : remainingDays < 0 ? 0 : remainingDays}
              </div>

              <div className="text-muted">
                {remainingDays === null
                  ? "No deadline"
                  : remainingDays < 0
                  ? "Overdue"
                  : remainingDays === 0
                  ? "Due today"
                  : "Days remaining"}
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Progress</span>
                <span className="fw-semibold">
                  {task.status === "Completed"
                    ? "100%"
                    : task.status === "In Progress"
                    ? "60%"
                    : task.status === "Blocked"
                    ? "20%"
                    : "0%"}
                </span>
              </div>

              <div className="progress rounded-pill" style={{ height: 10 }}>
                <div
                  className={`progress-bar ${
                    task.status === "Completed"
                      ? "bg-success"
                      : task.status === "Blocked"
                      ? "bg-danger"
                      : "bg-primary"
                  }`}
                  style={{
                    width:
                      task.status === "Completed"
                        ? "100%"
                        : task.status === "In Progress"
                        ? "60%"
                        : task.status === "Blocked"
                        ? "20%"
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="d-grid gap-3">
              {task.status !== "Completed" && (
                <button className="btn btn-success rounded-pill py-2" onClick={markAsComplete}>
                  <i className="bi bi-check-circle me-2"></i>
                  Mark as Complete
                </button>
              )}

               <button className="btn btn-outline-primary rounded-pill py-2" onClick={() => setShowEdit(true)} > <i className="bi bi-pencil me-2"></i> Edit Task </button>
                <button
              className="btn btn-danger w-100 rounded-pill"
              onClick={deleteTask}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Delete task
            </button>
            </div>
          </div>
        </div>
      </div>
      <EditTaskModal show={showEdit} handleClose={() => setShowEdit(false)} task={task} onUpdated={handleTaskUpdated} />
    </Layout>
  );
};

export default TaskDetails;