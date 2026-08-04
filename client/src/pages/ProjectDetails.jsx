//  import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Layout from "../components/Layout";
// import TaskCard from "../components/TaskCard";
// import CreateTaskModal from "../components/CreateTaskModal";
// import api from "../services/api";
// import toast from "react-hot-toast";

// const ProjectDetails = () => {
//   const { id } = useParams();

//   const [project, setProject] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [statusFilter, setStatusFilter] = useState("");

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/immutability
//     loadProject();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const loadProject = async () => {
//     try {
//       setLoading(true);

//       const [projectRes, tasksRes] = await Promise.all([
//         api.get(`/projects/${id}`),
//         api.get(`/tasks?project=${id}`),
//       ]);
//        console.log("project data",projectRes.data);
//        console.log("task data:",tasksRes.data)
//       setProject(projectRes.data);
//       setTasks(tasksRes.data);
//     } catch (error) {
//       toast.error("Failed to load project");
//       console.log("message:",error)
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTaskCreated = (task) => {
//     setTasks((prev) => [task, ...prev]);
//   };

//   const handleStatusChange = (updatedTask) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task._id === updatedTask._id ? updatedTask : task
//       )
//     );
//   };

//   const filteredTasks = statusFilter
//     ? tasks.filter((task) => task.status === statusFilter)
//     : tasks;

//   if (loading) {
//     return (
//       <Layout title="Project Details">
//         <div className="content-card text-center py-5">
//           <div className="spinner-border text-primary mb-3"></div>
//           <div className="text-muted">Loading project...</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title={project?.name || "Project Details"}>
//       <div className="content-card mb-4">
//         <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">
//           <div>
//             <h4 className="fw-bold mb-2">{project?.name}</h4>
//             <p className="text-muted mb-3">
//               {project?.description || "No description available"}
//             </p>

//             <div className="d-flex gap-4 flex-wrap text-muted small">
//               <span>
//                 <i className="bi bi-list-task me-1"></i>
//                 {tasks.length} Tasks
//               </span>
//               <span>
//                 <i className="bi bi-check-circle me-1"></i>
//                 {tasks.filter((t) => t.status === "Completed").length} Completed
//               </span>
//             </div>
//           </div>

//           <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(true)}>
//             <i className="bi bi-plus-lg me-2"></i>
//             Add Task
//           </button>
//         </div>
//       </div>

//       <div className="content-card mb-4">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//           <div className="filter-group">
//             <button
//               className={`filter-btn ${statusFilter === "" ? "active" : ""}`}
//               onClick={() => setStatusFilter("")}
//             >
//               All
//             </button>

//             <button
//               className={`filter-btn ${statusFilter === "To Do" ? "active" : ""}`}
//               onClick={() => setStatusFilter("To Do")}
//             >
//               To Do
//             </button>

//             <button
//               className={`filter-btn ${statusFilter === "In Progress" ? "active" : ""}`}
//               onClick={() => setStatusFilter("In Progress")}
//             >
//               In Progress
//             </button>

//             <button
//               className={`filter-btn ${statusFilter === "Completed" ? "active" : ""}`}
//               onClick={() => setStatusFilter("Completed")}
//             >
//               Completed
//             </button>

//             <button
//               className={`filter-btn ${statusFilter === "Blocked" ? "active" : ""}`}
//               onClick={() => setStatusFilter("Blocked")}
//             >
//               Blocked
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="content-card">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h5 className="fw-bold mb-0">Project Tasks</h5>
//           <span className="text-muted">{filteredTasks.length} tasks</span>
//         </div>

//         {filteredTasks.length === 0 ? (
//           <div className="text-center py-5">
//             <i className="bi bi-list-task display-4 text-muted"></i>
//             <h6 className="mt-3 fw-bold">No tasks found</h6>
//             <p className="text-muted">Create the first task for this project.</p>
//             <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowModal(true)}>
//               Create Task
//             </button>
//           </div>
//         ) : (
//           filteredTasks.map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               onStatusChange={handleStatusChange}
//             />
//           ))
//         )}
//       </div>

//       <CreateTaskModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         projectId={id}
//         onTaskCreated={handleTaskCreated}
//       />
//     </Layout>
//   );
// };

// export default ProjectDetails;

// --------------------------------------------------------------------------------------------

// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import Layout from "../components/Layout";
// import TaskCard from "../components/TaskCard";
// import CreateTaskModal from "../components/CreateTaskModal";
// import api from "../services/api";
// import toast from "react-hot-toast";

// const ProjectDetails = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [activeFilter, setActiveFilter] = useState(null);

//   // URL-based filters
//   const ownerFilter = searchParams.get("owner") || "";
//   const teamFilter = searchParams.get("team") || "";
//   const tagFilter = searchParams.get("tag") || "";
//   const projectFilter = searchParams.get("project") || "";
//   const statusFilter = searchParams.get("status") || "";

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/immutability
//     loadTasks();
//   }, []);

//   const loadTasks = async () => {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/tasks");

//       setTasks(data);
//     } catch (error) {
//       toast.error("Failed to load tasks");
//       console.log("message:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create filter options from task data
//   const filterOptions = useMemo(() => {
//     const owners = [];
//     const teams = [];
//     const projects = [];
//     const tags = [];

//     tasks.forEach((task) => {
//       // Owners
//       task.owners?.forEach((owner) => {
//         if (
//           owner?.name &&
//           !owners.some((item) => item.name === owner.name)
//         ) {
//           owners.push({
//             _id: owner._id,
//             name: owner.name,
//           });
//         }
//       });

//       // Teams
//       if (
//         task.team?.name &&
//         !teams.some((item) => item.name === task.team.name)
//       ) {
//         teams.push({
//           _id: task.team._id,
//           name: task.team.name,
//         });
//       }

//       // Projects
//       if (
//         task.project?.name &&
//         !projects.some((item) => item.name === task.project.name)
//       ) {
//         projects.push({
//           _id: task.project._id,
//           name: task.project.name,
//         });
//       }

//       // Tags
//       task.tags?.forEach((tag) => {
//         if (!tags.includes(tag)) {
//           tags.push(tag);
//         }
//       });
//     });

//     return {
//       owners,
//       teams,
//       projects,
//       tags,
//     };
//   }, [tasks]);

//   // Filter tasks based on URL parameters
//   const filteredTasks = useMemo(() => {
//     return tasks.filter((task) => {
//       const matchesOwner =
//         !ownerFilter ||
//         task.owners?.some((owner) => owner.name === ownerFilter);

//       const matchesTeam =
//         !teamFilter ||
//         task.team?.name === teamFilter;

//       const matchesTag =
//         !tagFilter ||
//         task.tags?.includes(tagFilter);

//       const matchesProject =
//         !projectFilter ||
//         task.project?.name === projectFilter;

//       const matchesStatus =
//         !statusFilter ||
//         task.status === statusFilter;

//       return (
//         matchesOwner &&
//         matchesTeam &&
//         matchesTag &&
//         matchesProject &&
//         matchesStatus
//       );
//     });
//   }, [
//     tasks,
//     ownerFilter,
//     teamFilter,
//     tagFilter,
//     projectFilter,
//     statusFilter,
//   ]);

//   // Update URL when filter option is selected
//   const handleFilterSelect = (key, value) => {
//     const params = new URLSearchParams(searchParams);

//     if (value) {
//       params.set(key, value);
//     } else {
//       params.delete(key);
//     }

//     setSearchParams(params);
//     setActiveFilter(null);
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchParams({});
//     setActiveFilter(null);
//   };

//   // Handle task status update from TaskCard
//   const handleStatusChange = (updatedTask) => {
//     setTasks((prev) =>
//       prev.map((task) =>
//         task._id === updatedTask._id ? updatedTask : task
//       )
//     );
//   };

//   // Handle new task creation
//   const handleTaskCreated = (task) => {
//     setTasks((prev) => [task, ...prev]);
//     setShowModal(false);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".filter-dropdown-wrapper")) {
//         setActiveFilter(null);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   if (loading) {
//     return (
//       <Layout title="Tasks">
//         <div className="content-card text-center py-5">
//           <div className="spinner-border text-primary mb-3"></div>
//           <div className="text-muted">Loading tasks...</div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout title="Tasks">
//       {/* Page Header */}
//       <div className="content-card mb-4">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//           <div>
//             <h4 className="fw-bold mb-1">Tasks</h4>
//             <p className="text-muted mb-0">
//               Manage and filter all your tasks
//             </p>
//           </div>

//           <button
//             className="btn btn-primary rounded-pill px-4"
//             onClick={() => setShowModal(true)}
//           >
//             <i className="bi bi-plus-lg me-2"></i>
//             Add Task
//           </button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="content-card mb-4">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
//           <div className="filter-group">

//             {/* All */}
//             <button
//               className={`filter-btn ${
//                 !ownerFilter &&
//                 !teamFilter &&
//                 !tagFilter &&
//                 !projectFilter &&
//                 !statusFilter
//                   ? "active"
//                   : ""
//               }`}
//               onClick={clearFilters}
//             >
//               All
//             </button>

//             {/* Owner */}
//             <div className="filter-dropdown-wrapper">
//               <button
//                 className={`filter-btn ${
//                   ownerFilter ? "active" : ""
//                 }`}
//                 onClick={(event) => {
//                   event.stopPropagation();

//                   setActiveFilter(
//                     activeFilter === "owner"
//                       ? null
//                       : "owner"
//                   );
//                 }}
//               >
//                 Owner
//                 <i className="bi bi-chevron-down ms-2"></i>
//               </button>

//               {activeFilter === "owner" && (
//                 <div className="filter-dropdown">
//                   <button
//                     className={!ownerFilter ? "selected" : ""}
//                     onClick={() =>
//                       handleFilterSelect("owner", "")
//                     }
//                   >
//                     All Owners
//                   </button>

//                   {filterOptions.owners.map((owner) => (
//                     <button
//                       key={owner._id}
//                       className={
//                         ownerFilter === owner.name
//                           ? "selected"
//                           : ""
//                       }
//                       onClick={() =>
//                         handleFilterSelect(
//                           "owner",
//                           owner.name
//                         )
//                       }
//                     >
//                       {owner.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Team */}
//             <div className="filter-dropdown-wrapper">
//               <button
//                 className={`filter-btn ${
//                   teamFilter ? "active" : ""
//                 }`}
//                 onClick={(event) => {
//                   event.stopPropagation();

//                   setActiveFilter(
//                     activeFilter === "team"
//                       ? null
//                       : "team"
//                   );
//                 }}
//               >
//                 Team
//                 <i className="bi bi-chevron-down ms-2"></i>
//               </button>

//               {activeFilter === "team" && (
//                 <div className="filter-dropdown">
//                   <button
//                     className={!teamFilter ? "selected" : ""}
//                     onClick={() =>
//                       handleFilterSelect("team", "")
//                     }
//                   >
//                     All Teams
//                   </button>

//                   {filterOptions.teams.map((team) => (
//                     <button
//                       key={team._id}
//                       className={
//                         teamFilter === team.name
//                           ? "selected"
//                           : ""
//                       }
//                       onClick={() =>
//                         handleFilterSelect(
//                           "team",
//                           team.name
//                         )
//                       }
//                     >
//                       {team.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Tags */}
//             <div className="filter-dropdown-wrapper">
//               <button
//                 className={`filter-btn ${
//                   tagFilter ? "active" : ""
//                 }`}
//                 onClick={(event) => {
//                   event.stopPropagation();

//                   setActiveFilter(
//                     activeFilter === "tag"
//                       ? null
//                       : "tag"
//                   );
//                 }}
//               >
//                 Tags
//                 <i className="bi bi-chevron-down ms-2"></i>
//               </button>

//               {activeFilter === "tag" && (
//                 <div className="filter-dropdown">
//                   <button
//                     className={!tagFilter ? "selected" : ""}
//                     onClick={() =>
//                       handleFilterSelect("tag", "")
//                     }
//                   >
//                     All Tags
//                   </button>

//                   {filterOptions.tags.map((tag) => (
//                     <button
//                       key={tag}
//                       className={
//                         tagFilter === tag
//                           ? "selected"
//                           : ""
//                       }
//                       onClick={() =>
//                         handleFilterSelect("tag", tag)
//                       }
//                     >
//                       {tag}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Project */}
//             <div className="filter-dropdown-wrapper">
//               <button
//                 className={`filter-btn ${
//                   projectFilter ? "active" : ""
//                 }`}
//                 onClick={(event) => {
//                   event.stopPropagation();

//                   setActiveFilter(
//                     activeFilter === "project"
//                       ? null
//                       : "project"
//                   );
//                 }}
//               >
//                 Project
//                 <i className="bi bi-chevron-down ms-2"></i>
//               </button>

//               {activeFilter === "project" && (
//                 <div className="filter-dropdown">
//                   <button
//                     className={!projectFilter ? "selected" : ""}
//                     onClick={() =>
//                       handleFilterSelect("project", "")
//                     }
//                   >
//                     All Projects
//                   </button>

//                   {filterOptions.projects.map((project) => (
//                     <button
//                       key={project._id}
//                       className={
//                         projectFilter === project.name
//                           ? "selected"
//                           : ""
//                       }
//                       onClick={() =>
//                         handleFilterSelect(
//                           "project",
//                           project.name
//                         )
//                       }
//                     >
//                       {project.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Status */}
//             <div className="filter-dropdown-wrapper">
//               <button
//                 className={`filter-btn ${
//                   statusFilter ? "active" : ""
//                 }`}
//                 onClick={(event) => {
//                   event.stopPropagation();

//                   setActiveFilter(
//                     activeFilter === "status"
//                       ? null
//                       : "status"
//                   );
//                 }}
//               >
//                 Status
//                 <i className="bi bi-chevron-down ms-2"></i>
//               </button>

//               {activeFilter === "status" && (
//                 <div className="filter-dropdown">
//                   <button
//                     className={!statusFilter ? "selected" : ""}
//                     onClick={() =>
//                       handleFilterSelect("status", "")
//                     }
//                   >
//                     All Status
//                   </button>

//                   <button
//                     className={
//                       statusFilter === "To Do"
//                         ? "selected"
//                         : ""
//                     }
//                     onClick={() =>
//                       handleFilterSelect(
//                         "status",
//                         "To Do"
//                       )
//                     }
//                   >
//                     To Do
//                   </button>

//                   <button
//                     className={
//                       statusFilter === "In Progress"
//                         ? "selected"
//                         : ""
//                     }
//                     onClick={() =>
//                       handleFilterSelect(
//                         "status",
//                         "In Progress"
//                       )
//                     }
//                   >
//                     In Progress
//                   </button>

//                   <button
//                     className={
//                       statusFilter === "Completed"
//                         ? "selected"
//                         : ""
//                     }
//                     onClick={() =>
//                       handleFilterSelect(
//                         "status",
//                         "Completed"
//                       )
//                     }
//                   >
//                     Completed
//                   </button>

//                   <button
//                     className={
//                       statusFilter === "Blocked"
//                         ? "selected"
//                         : ""
//                     }
//                     onClick={() =>
//                       handleFilterSelect(
//                         "status",
//                         "Blocked"
//                       )
//                     }
//                   >
//                     Blocked
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Clear Filters */}
//           {(ownerFilter ||
//             teamFilter ||
//             tagFilter ||
//             projectFilter ||
//             statusFilter) && (
//             <button
//               className="btn btn-sm btn-outline-secondary rounded-pill"
//               onClick={clearFilters}
//             >
//               <i className="bi bi-x-lg me-1"></i>
//               Clear Filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Task List */}
//       <div className="content-card">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h5 className="fw-bold mb-0">
//             Task List
//           </h5>

//           <span className="text-muted">
//             {filteredTasks.length} tasks
//           </span>
//         </div>

//         {filteredTasks.length === 0 ? (
//           <div className="text-center py-5">
//             <i className="bi bi-list-task display-4 text-muted"></i>

//             <h6 className="mt-3 fw-bold">
//               No tasks found
//             </h6>

//             <p className="text-muted mb-3">
//               Try changing or clearing your filters.
//             </p>

//             <button
//               className="btn btn-primary rounded-pill px-4"
//               onClick={clearFilters}
//             >
//               Clear Filters
//             </button>
//           </div>
//         ) : (
//           filteredTasks.map((task) => (
//             <TaskCard
//               key={task._id}
//               task={task}
//               onStatusChange={handleStatusChange}
//             />
//           ))
//         )}
//       </div>

//       {/* Create Task Modal */}
//       <CreateTaskModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         onTaskCreated={handleTaskCreated}
//       />
//     </Layout>
//   );
// };

// export default ProjectDetails;

// -----------------------------------------------------------------------
 import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import api from "../services/api";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  // URL filters
  const ownerFilter = searchParams.get("owner") || "";
  const teamFilter = searchParams.get("team") || "";
  const tagFilter = searchParams.get("tag") || "";
  const projectFilter = searchParams.get("project") || "";
  const statusFilter = searchParams.get("status") || "";

  // Check whether any filter is applied
  const hasFilters =
    ownerFilter ||
    teamFilter ||
    tagFilter ||
    projectFilter ||
    statusFilter;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);

      const [projectRes, projectTasksRes, allTasksRes] =
        await Promise.all([
          api.get(`/projects/${id}`),

          // Current project's tasks
          api.get(`/tasks?project=${id}`),

          // ALL tasks
          api.get("/tasks"),
        ]);

      console.log("project data:", projectRes.data);
      console.log("project tasks:", projectTasksRes.data);
      console.log("all tasks:", allTasksRes.data);

      setProject(projectRes.data);
      setProjectTasks(projectTasksRes.data);
      setAllTasks(allTasksRes.data);
    } catch (error) {
      toast.error("Failed to load project");
      console.log("message:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Filter options are created from ALL tasks.
   *
   * This is important because when a filter is selected,
   * we want to search across all tasks.
   */
  const filterOptions = useMemo(() => {
    const owners = [];
    const teams = [];
    const projects = [];
    const tags = [];

    allTasks.forEach((task) => {
      // Owners
      task.owners?.forEach((owner) => {
        if (
          owner?.name &&
          !owners.some(
            (item) => item.name === owner.name
          )
        ) {
          owners.push({
            _id: owner._id,
            name: owner.name,
          });
        }
      });

      // Teams
      if (
        task.team?.name &&
        !teams.some(
          (item) => item.name === task.team.name
        )
      ) {
        teams.push({
          _id: task.team._id,
          name: task.team.name,
        });
      }

      // Projects
      if (
        task.project?.name &&
        !projects.some(
          (item) => item.name === task.project.name
        )
      ) {
        projects.push({
          _id: task.project._id,
          name: task.project.name,
        });
      }

      // Tags
      task.tags?.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });

    return {
      owners,
      teams,
      projects,
      tags,
    };
  }, [allTasks]);

  /*
   * IMPORTANT:
   *
   * No filter:
   *     show only current project's tasks.
   *
   * Filter applied:
   *     search through ALL tasks.
   */
  const displayedTasks = useMemo(() => {
    // No filter -> project tasks
    if (!hasFilters) {
      return projectTasks;
    }

    // Filter -> all tasks
    return allTasks.filter((task) => {
      const matchesOwner =
        !ownerFilter ||
        task.owners?.some(
          (owner) => owner.name === ownerFilter
        );

      const matchesTeam =
        !teamFilter ||
        task.team?.name === teamFilter;

      const matchesTag =
        !tagFilter ||
        task.tags?.includes(tagFilter);

      const matchesProject =
        !projectFilter ||
        task.project?.name === projectFilter;

      const matchesStatus =
        !statusFilter ||
        task.status === statusFilter;

      return (
        matchesOwner &&
        matchesTeam &&
        matchesTag &&
        matchesProject &&
        matchesStatus
      );
    });
  }, [
    hasFilters,
    projectTasks,
    allTasks,
    ownerFilter,
    teamFilter,
    tagFilter,
    projectFilter,
    statusFilter,
  ]);

  /*
   * Update URL when filter is selected.
   */
  const handleFilterSelect = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setSearchParams(params);
    setActiveFilter(null);
  };

  /*
   * Clear all filters.
   *
   * This returns the page to the project's tasks.
   */
  const clearFilters = () => {
    setSearchParams({});
    setActiveFilter(null);
  };

  /*
   * Task created from CreateTaskModal.
   *
   * Since the modal creates a task for the current project,
   * add it to projectTasks and allTasks.
   */
  const handleTaskCreated = (task) => {
    setProjectTasks((prev) => [task, ...prev]);

    setAllTasks((prev) => [task, ...prev]);

    setShowModal(false);
  };

  /*
   * Update task status.
   */
  const handleStatusChange = (updatedTask) => {
    setProjectTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );

    setAllTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );
  };

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveFilter(null);
    };

    if (activeFilter) {
      document.addEventListener(
        "click",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, [activeFilter]);

  if (loading) {
    return (
      <Layout title="Project Details">
        <div className="content-card text-center py-5">
          <div className="spinner-border text-primary mb-3"></div>

          <div className="text-muted">
            Loading project...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={project?.name || "Project Details"}>

      {/* Project Header */}
      <div className="content-card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div>
            <h4 className="fw-bold mb-2">
              {project?.name}
            </h4>

            <p className="text-muted mb-3">
              {project?.description ||
                "No description available"}
            </p>

            <div className="d-flex gap-4 flex-wrap text-muted small">

              <span>
                <i className="bi bi-list-task me-1"></i>
                {projectTasks.length} Tasks
              </span>

              <span>
                <i className="bi bi-check-circle me-1"></i>
                {
                  projectTasks.filter(
                    (task) =>
                      task.status === "Completed"
                  ).length
                }{" "}
                Completed
              </span>

            </div>
          </div>

          {/* Keep CreateTaskModal functionality */}
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Add Task
          </button>

        </div>
      </div>

      {/* Filters */}
      <div className="content-card mb-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div className="d-flex flex-wrap gap-2">

            {/* ALL */}
            <button
              className={`btn rounded-pill px-3 ${
                !hasFilters
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={clearFilters}
            >
              All
            </button>

            {/* OWNER */}
            <div
              className="position-relative"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                className={`btn rounded-pill px-3 ${
                  ownerFilter
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "owner"
                      ? null
                      : "owner"
                  )
                }
              >
                Owner
                <i className="bi bi-chevron-down ms-2"></i>
              </button>

              {activeFilter === "owner" && (
                <div
                  className="dropdown-menu show position-absolute"
                  style={{
                    minWidth: "180px",
                    zIndex: 1050,
                  }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      handleFilterSelect(
                        "owner",
                        ""
                      )
                    }
                  >
                    All Owners
                  </button>

                  {filterOptions.owners.map(
                    (owner) => (
                      <button
                        key={owner._id}
                        className={`dropdown-item ${
                          ownerFilter === owner.name
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterSelect(
                            "owner",
                            owner.name
                          )
                        }
                      >
                        {owner.name}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* TEAM */}
            <div
              className="position-relative"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                className={`btn rounded-pill px-3 ${
                  teamFilter
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "team"
                      ? null
                      : "team"
                  )
                }
              >
                Team
                <i className="bi bi-chevron-down ms-2"></i>
              </button>

              {activeFilter === "team" && (
                <div
                  className="dropdown-menu show position-absolute"
                  style={{
                    minWidth: "180px",
                    zIndex: 1050,
                  }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      handleFilterSelect(
                        "team",
                        ""
                      )
                    }
                  >
                    All Teams
                  </button>

                  {filterOptions.teams.map(
                    (team) => (
                      <button
                        key={team._id}
                        className={`dropdown-item ${
                          teamFilter === team.name
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterSelect(
                            "team",
                            team.name
                          )
                        }
                      >
                        {team.name}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* TAGS */}
            <div
              className="position-relative"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                className={`btn rounded-pill px-3 ${
                  tagFilter
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "tag"
                      ? null
                      : "tag"
                  )
                }
              >
                Tags
                <i className="bi bi-chevron-down ms-2"></i>
              </button>

              {activeFilter === "tag" && (
                <div
                  className="dropdown-menu show position-absolute"
                  style={{
                    minWidth: "180px",
                    zIndex: 1050,
                  }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      handleFilterSelect(
                        "tag",
                        ""
                      )
                    }
                  >
                    All Tags
                  </button>

                  {filterOptions.tags.map(
                    (tag) => (
                      <button
                        key={tag}
                        className={`dropdown-item ${
                          tagFilter === tag
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterSelect(
                            "tag",
                            tag
                          )
                        }
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* PROJECT */}
            <div
              className="position-relative"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                className={`btn rounded-pill px-3 ${
                  projectFilter
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "project"
                      ? null
                      : "project"
                  )
                }
              >
                Project
                <i className="bi bi-chevron-down ms-2"></i>
              </button>

              {activeFilter === "project" && (
                <div
                  className="dropdown-menu show position-absolute"
                  style={{
                    minWidth: "220px",
                    zIndex: 1050,
                  }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      handleFilterSelect(
                        "project",
                        ""
                      )
                    }
                  >
                    All Projects
                  </button>

                  {filterOptions.projects.map(
                    (projectItem) => (
                      <button
                        key={projectItem._id}
                        className={`dropdown-item ${
                          projectFilter ===
                          projectItem.name
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterSelect(
                            "project",
                            projectItem.name
                          )
                        }
                      >
                        {projectItem.name}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* STATUS */}
            <div
              className="position-relative"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <button
                className={`btn rounded-pill px-3 ${
                  statusFilter
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "status"
                      ? null
                      : "status"
                  )
                }
              >
                Status
                <i className="bi bi-chevron-down ms-2"></i>
              </button>

              {activeFilter === "status" && (
                <div
                  className="dropdown-menu show position-absolute"
                  style={{
                    minWidth: "180px",
                    zIndex: 1050,
                  }}
                >
                  <button
                    className="dropdown-item"
                    onClick={() =>
                      handleFilterSelect(
                        "status",
                        ""
                      )
                    }
                  >
                    All Status
                  </button>

                  <button
                    className={`dropdown-item ${
                      statusFilter === "To Do"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterSelect(
                        "status",
                        "To Do"
                      )
                    }
                  >
                    To Do
                  </button>

                  <button
                    className={`dropdown-item ${
                      statusFilter === "In Progress"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterSelect(
                        "status",
                        "In Progress"
                      )
                    }
                  >
                    In Progress
                  </button>

                  <button
                    className={`dropdown-item ${
                      statusFilter === "Completed"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterSelect(
                        "status",
                        "Completed"
                      )
                    }
                  >
                    Completed
                  </button>

                  <button
                    className={`dropdown-item ${
                      statusFilter === "Blocked"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterSelect(
                        "status",
                        "Blocked"
                      )
                    }
                  >
                    Blocked
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill"
              onClick={clearFilters}
            >
              <i className="bi bi-x-lg me-1"></i>
              Clear Filters
            </button>
          )}

        </div>
      </div>

      {/* Task List */}
      <div className="content-card">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h5 className="fw-bold mb-0">
              {hasFilters
                ? "Filtered Tasks"
                : "Project Tasks"}
            </h5>

            {hasFilters && (
              <small className="text-muted">
                Showing tasks from all projects
              </small>
            )}
          </div>

          <span className="text-muted">
            {displayedTasks.length} tasks
          </span>

        </div>

        {displayedTasks.length === 0 ? (
          <div className="text-center py-5">

            <i className="bi bi-list-task display-4 text-muted"></i>

            <h6 className="mt-3 fw-bold">
              No tasks found
            </h6>

            <p className="text-muted">
              Try changing or clearing your filters.
            </p>

            {hasFilters && (
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={clearFilters}
              >
                Show Project Tasks
              </button>
            )}

          </div>
        ) : (
          displayedTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))
        )}

      </div>

      {/* Create Task Modal */}
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