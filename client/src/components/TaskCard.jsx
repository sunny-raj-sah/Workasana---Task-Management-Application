import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const TaskCard = ({ task, onStatusChange }) => {
  const handleStatus = async (status) => {
    try {
      const { data } = await api.patch(`/tasks/${task._id}/status`, {
        status,
      });

      onStatusChange(data);
      toast.success("Task updated");
    } catch (error) {
      toast.error("Failed to update task");
      console.log("message:", error)
    }
  };

  const statusColor = {
    "To Do": "secondary",
    "In Progress": "primary",
    Completed: "success",
    Blocked: "danger",
  };

  return (
    <div className="task-card">
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
        <div>
          <h6 className="fw-bold mb-1">{task.name}</h6>
          <div className="text-muted small">
            {task.team?.name} • {task.owners?.map((o) => o.name).join(", ")}
          </div>
        </div>

        <span className={`badge bg-${statusColor[task.status]} rounded-pill px-3 py-2`}
        >
          {task.status}
        </span>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {task.tags?.map((tag) => (
          <span key={tag} className="badge bg-light text-dark border rounded-pill px-3 py-2">
            #{tag}
          </span>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="text-muted small">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <select className="form-select form-select-sm rounded-pill" value={task.status} onChange={(e) => handleStatus(e.target.value)} style={{ width: 140 }}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Blocked</option>
          </select>

          <Link to={`/tasks/${task._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;