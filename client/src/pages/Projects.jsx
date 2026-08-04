//  import { useEffect, useState } from "react";
// import Layout from "../components/Layout";
// import ProjectCard from "../components/ProjectCard";
// import CreateProjectModal from "../components/CreateProjectModal";
// import { useApp } from "../context/AppContext";
// import api from "../services/api";
// import toast from "react-hot-toast";

// const Projects = () => {
//   const { state, dispatch } = useApp();
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/immutability
//     fetchProjects();
   
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       dispatch({ type: "SET_LOADING", payload: true });

//       const { data } = await api.get("/projects");

//       dispatch({ type: "SET_PROJECTS", payload: data });
//     } catch (error) {
//       toast.error("Failed to load projects");
//       console.log("message:",error)
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   return (
//     <Layout title="Projects"
//     subtitle="Create and manage your projects">
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h5 className="fw-bold mb-1">All Projects</h5>
//           <p className="text-muted mb-0">Manage and track your projects</p>
//         </div>

//         <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(true)}>
//           <i className="bi bi-plus-lg me-2"></i>
//           New Project
//         </button>
//       </div>

//       {state.loading ? (
//         <div className="content-card text-center py-5">
//           <div className="spinner-border text-primary mb-3"></div>
//           <div className="text-muted">Loading projects...</div>
//         </div>
//       ) : state.projects.length === 0 ? (
//         <div className="content-card text-center py-5">
//           <i className="bi bi-folder-x display-4 text-muted"></i>
//           <h5 className="mt-3 fw-bold">No projects found</h5>
//           <p className="text-muted">Create your first project to get started.</p>
//           <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(true)}>
//             Create Project
//           </button>
//         </div>
//       ) : (
//         <div className="row g-4">
//           {state.projects.map((project) => (
//             <div key={project._id} className="col-12 col-md-6 col-xl-4">
//               <ProjectCard project={project} />
//             </div>
//           ))}
//         </div>
//       )}

//       <CreateProjectModal show={showModal} handleClose={() => setShowModal(false)} />
//     </Layout>
//   );
// };

// export default Projects;

// -----------------------------------------------------

import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import TaskSearch from "../components/TaskSearch";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Projects = () => {
  const { state, dispatch } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProjects();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      const { data } = await api.get("/projects");

      dispatch({
        type: "SET_PROJECTS",
        payload: data,
      });
    } catch (error) {
      toast.error("Failed to load projects");
      console.log("message:", error);
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  /*
   * Search projects by:
   * 1. Project name
   * 2. Project description
   */
  const filteredProjects = state.projects.filter((project) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      project.name
        ?.toLowerCase()
        .includes(searchValue) ||
      project.description
        ?.toLowerCase()
        .includes(searchValue)
    );
  });

  return (
    <Layout title="Projects">

      {/* Header */}
      <div className="content-card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>
            <h4 className="fw-bold mb-1">
              All Projects
            </h4>

            <p className="text-muted mb-0">
              Manage and track your projects
            </p>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">

            {/* Search */}
            <TaskSearch
              value={search}
              onChange={setSearch}
            />

            {/* Create Project */}
            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-lg me-2"></i>
              New Project
            </button>

          </div>

        </div>
      </div>

      {/* Projects */}
      {state.loading ? (
        <div className="content-card text-center py-5">

          <div className="spinner-border text-primary mb-3"></div>

          <div className="text-muted">
            Loading projects...
          </div>

        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="content-card text-center py-5">

          <i className="bi bi-folder-x display-4 text-muted"></i>

          <h5 className="mt-3 fw-bold">
            {search
              ? "No projects found"
              : "No projects found"}
          </h5>

          <p className="text-muted">
            {search
              ? "Try searching with a different project name."
              : "Create your first project to get started."}
          </p>

          {search ? (
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          ) : (
            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={() => setShowModal(true)}
            >
              Create Project
            </button>
          )}

        </div>
      ) : (
        <>
          {/* Result Count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              Projects
            </h5>

            <span className="text-muted small">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1
                ? "project"
                : "projects"}
            </span>
          </div>

          {/* Project Cards */}
          <div className="row g-4">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="col-12 col-md-6 col-xl-4"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        show={showModal}
        handleClose={() => setShowModal(false)}
      />

    </Layout>
  );
};

export default Projects;