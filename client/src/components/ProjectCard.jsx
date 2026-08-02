import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useApp } from "../context/AppContext";

const ProjectCard = ({ project }) => {
  const { dispatch } = useApp();

  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${project._id}`);

      dispatch({ type: "REMOVE_PROJECT", payload: project._id });

      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
      console.log("message :",error)
    }
  };

  return (
    <div className="content-card h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="rounded-4 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
          <i className="bi bi-folder-fill fs-4"></i>
        </div>

        <button className="btn btn-light btn-sm rounded-pill" onClick={handleDelete}>
          <i className="bi bi-trash"></i>
        </button>
      </div>

      <h5 className="fw-bold mb-2">{project.name}</h5>

      <p className="text-muted small mb-4">
        {project.description || "No description provided"}
      </p>

      <div className="d-flex justify-content-between align-items-center mt-auto">
        <small className="text-muted">
          {new Date(project.createdAt).toLocaleDateString()}
        </small>

        <Link to={`/projects/${project._id}`} className="btn btn-primary btn-sm rounded-pill px-3">
          Open
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;