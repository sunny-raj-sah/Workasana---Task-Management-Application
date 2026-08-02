 import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TeamModal from "../components/TeamModal";
import api from "../services/api";
import toast from "react-hot-toast";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/teams");
      setTeams(data);
    } catch (error) {
      toast.error("Failed to load teams");
      console.log("message:", error)
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = (team, isEdit) => {
    if (isEdit) {
      setTeams((prev) =>
        prev.map((t) => (t._id === team._id ? team : t))
      );
    } else {
      setTeams((prev) => [team, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team?")) return;

    try {
      await api.delete(`/teams/${id}`);
      setTeams((prev) => prev.filter((t) => t._id !== id));
      toast.success("Team deleted");
    } catch (error) {
      toast.error("Failed to delete team");
      console.log("message:", error)
    }
  };

  return (
    <Layout title="Teams"
    subtitle="Create and manage your teams">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h5 className="fw-bold mb-1">Team Management</h5>
          <p className="text-muted mb-0">Create and manage your teams</p>
        </div>

        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={() => {
            setSelectedTeam(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-lg me-2"></i>
          New Team
        </button>
      </div>

      {loading ? (
        <div className="content-card text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>
          <div className="text-muted">Loading teams...</div>
        </div>
      ) : teams.length === 0 ? (
        <div className="content-card text-center py-5">
          <i className="bi bi-people display-4 text-muted"></i>
          <h5 className="mt-3 fw-bold">No teams found</h5>
          <p className="text-muted">Create your first team to get started.</p>
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setShowModal(true)}
          >
            Create Team
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {teams.map((team) => (
            <div key={team._id} className="col-12 col-md-6 col-xl-4">
              <div className="content-card h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="rounded-4 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <i className="bi bi-people-fill fs-4"></i>
                  </div>

                  <div className="dropdown">
                    <button className="btn btn-light btn-sm rounded-pill" data-bs-toggle="dropdown">
                      <i className="bi bi-three-dots"></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedTeam(team);
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Edit
                        </button>
                      </li>

                      <li><hr className="dropdown-divider" /></li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(team._id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <h5 className="fw-bold mb-2">{team.name}</h5>

                <p className="text-muted small mb-4">
                  {team.description || "No description provided"}
                </p>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <small className="text-muted">Team</small>
                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        team={selectedTeam}
        onSaved={handleSaved}
      />
    </Layout>
  );
};

export default Teams;