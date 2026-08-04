// import { useEffect, useState } from "react";
// import { Modal, Button, Form } from "react-bootstrap";
// import api from "../services/api";
// import toast from "react-hot-toast";

// const CreateTaskModal = ({ show, handleClose, projectId, onTaskCreated }) => {
//   const [teams, setTeams] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);


//   const [form, setForm] = useState({
//     name: "",
//     team: "",
//     owners: [],
//     tags: "",
//     dueDate: "",
//     timeToComplete: 1,
//   });



//   const loadData = async () => {
//     try {
//       const [teamsRes, usersRes] = await Promise.all([
//         api.get("/teams"),
//         api.get("/users"),
//       ]);

//       setTeams(teamsRes.data);
//       setUsers(usersRes.data);
//     } catch (error) {
//       toast.error("Failed to load form data");
//       console.log("message:",error)
//     }
//   };
//   useEffect(() => {
//     if (show) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       loadData();
//     }
//   }, [show]);
//   const handleOwnerChange = (userId) => {
//     setForm((prev) => ({
//       ...prev,
//       owners: prev.owners.includes(userId)
//         ? prev.owners.filter((id) => id !== userId)
//         : [...prev.owners, userId],
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.team || form.owners.length === 0) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         name: form.name,
//         project: projectId,
//         team: form.team,
//         owners: form.owners,
//         tags: form.tags
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean),
//         dueDate: form.dueDate || undefined,
//         timeToComplete: Number(form.timeToComplete),
//       };

//       const { data } = await api.post("/tasks", payload);

//       onTaskCreated(data);
//       toast.success("Task created successfully");

//       setForm({
//         name: "",
//         team: "",
//         owners: [],
//         tags: "",
//         dueDate: "",
//         timeToComplete: 1,
//       });

//       handleClose();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to create task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>Create New Task</Modal.Title>
//       </Modal.Header>

//       <Form onSubmit={handleSubmit}>
//         <Modal.Body>
//           <div className="row g-3">
//             <div className="col-12">
//               <Form.Label>Task Name</Form.Label>
//               <Form.Control
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 placeholder="Enter task name"
//               />
//             </div>

//             <div className="col-md-6">
//               <Form.Label>Team</Form.Label>
//               <Form.Select
//                 value={form.team}
//                 onChange={(e) => setForm({ ...form, team: e.target.value })}
//               >
//                 <option value="">Select team</option>
//                 {teams.map((team) => (
//                   <option key={team._id} value={team._id}>
//                     {team.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </div>

//             <div className="col-md-6">
//               <Form.Label>Time (Days)</Form.Label>
//               <Form.Control
//                 type="number"
//                 min="1"
//                 value={form.timeToComplete}
//                 onChange={(e) =>
//                   setForm({ ...form, timeToComplete: e.target.value })
//                 }
//               />
//             </div>

//             <div className="col-12">
//               <Form.Label>Owners</Form.Label>
//               <div className="border rounded-4 p-3">
//                 <div className="row g-2">
//                   {users.map((user) => (
//                     <div key={user._id} className="col-md-6">
//                       <Form.Check
//                         type="checkbox"
//                         label={`${user.name} (${user.email})`}
//                         checked={form.owners.includes(user._id)}
//                         onChange={() => handleOwnerChange(user._id)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-6">
//               <Form.Label>Tags</Form.Label>
//               <Form.Control
//                 value={form.tags}
//                 onChange={(e) => setForm({ ...form, tags: e.target.value })}
//                 placeholder="UI, Urgent, Backend"
//               />
//             </div>

//             <div className="col-md-6">
//               <Form.Label>Due Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={form.dueDate}
//                 onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//               />
//             </div>
//           </div>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading}>
//             {loading ? "Creating..." : "Create Task"}
//           </Button>
//         </Modal.Footer>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateTaskModal;

// --------------------------------------------------------------------

import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../services/api";
import toast from "react-hot-toast";

const CreateTaskModal = ({
  show,
  handleClose,
  projectId,
  onTaskCreated,
}) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
const [newTag, setNewTag] = useState("");

  const [form, setForm] = useState({
    name: "",
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    timeToComplete: 1,
  });

  const loadData = async () => {
    try {
      const [teamsRes, usersRes, tasksRes] =
        await Promise.all([
          api.get("/teams"),
          api.get("/users"),
          api.get("/tasks"),
        ]);

      setTeams(teamsRes.data);
      setUsers(usersRes.data);

      // Get unique tags from existing tasks
      const tags = [
        ...new Set(
          tasksRes.data.flatMap(
            (task) => task.tags || []
          )
        ),
      ];

      setAvailableTags(tags);
    } catch (error) {
      toast.error("Failed to load form data");
      console.log("message:", error);
    }
  };

  useEffect(() => {
    if (show) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [show]);

  // Owner selection
  const handleOwnerChange = (userId) => {
    setForm((prev) => ({
      ...prev,
      owners: prev.owners.includes(userId)
        ? prev.owners.filter(
            (id) => id !== userId
          )
        : [...prev.owners, userId],
    }));
  };

  // Tag selection
 const handleTagChange = (tag) => {
  setForm((prev) => ({
    ...prev,
    tags: prev.tags.includes(tag)
      ? prev.tags.filter(
          (item) => item !== tag
        )
      : [...prev.tags, tag],
  }));
};

const addCustomTag = () => {
  const tag = newTag.trim();

  if (!tag) return;

  // Don't add duplicate tags
  if (
    form.tags.some(
      (item) =>
        item.toLowerCase() === tag.toLowerCase()
    )
  ) {
    toast.error("Tag already selected");
    return;
  }

  setForm((prev) => ({
    ...prev,
    tags: [...prev.tags, tag],
  }));

  // Add it to available tags as well
  setAvailableTags((prev) =>
    prev.some(
      (item) =>
        item.toLowerCase() === tag.toLowerCase()
    )
      ? prev
      : [...prev, tag]
  );

  setNewTag("");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.team ||
      form.owners.length === 0
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        project: projectId,
        team: form.team,
        owners: form.owners,
        tags: form.tags,
        dueDate:
          form.dueDate || undefined,
        timeToComplete: Number(
          form.timeToComplete
        ),
      };

      const { data } = await api.post(
        "/tasks",
        payload
      );

      onTaskCreated(data);

      toast.success(
        "Task created successfully"
      );

      setForm({
        name: "",
        team: "",
        owners: [],
        tags: [],
        dueDate: "",
        timeToComplete: 1,
      });

      handleClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create task"
      );

      console.log("message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Create New Task
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row g-3">

            {/* Task Name */}
            <div className="col-12">
              <Form.Label>
                Task Name
              </Form.Label>

              <Form.Control
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Enter task name"
              />
            </div>

            {/* Team */}
            <div className="col-md-6">
              <Form.Label>
                Team
              </Form.Label>

              <Form.Select
                value={form.team}
                onChange={(e) =>
                  setForm({
                    ...form,
                    team: e.target.value,
                  })
                }
              >
                <option value="">
                  Select team
                </option>

                {teams.map((team) => (
                  <option
                    key={team._id}
                    value={team._id}
                  >
                    {team.name}
                  </option>
                ))}
              </Form.Select>
            </div>

            {/* Time */}
            <div className="col-md-6">
              <Form.Label>
                Time (Days)
              </Form.Label>

              <Form.Control
                type="number"
                min="1"
                value={form.timeToComplete}
                onChange={(e) =>
                  setForm({
                    ...form,
                    timeToComplete:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Owners */}
            <div className="col-12">
              <Form.Label>
                Owners
              </Form.Label>

              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {form.owners.length === 0
                    ? "Select owners"
                    : `${form.owners.length} owner${
                        form.owners.length > 1
                          ? "s"
                          : ""
                      } selected`}
                </button>

                <div
                  className="dropdown-menu w-100 p-2"
                  style={{
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  {users.length === 0 ? (
                    <div className="text-muted small px-2 py-2">
                      No users available
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user._id}
                        className="dropdown-item-text"
                      >
                        <Form.Check
                          type="checkbox"
                          id={`owner-${user._id}`}
                          label={`${user.name} (${user.email})`}
                          checked={form.owners.includes(
                            user._id
                          )}
                          onChange={() =>
                            handleOwnerChange(
                              user._id
                            )
                          }
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Owners */}
              {form.owners.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {form.owners.map((ownerId) => {
                    const owner = users.find(
                      (user) =>
                        user._id === ownerId
                    );

                    if (!owner) return null;

                    return (
                      <span
                        key={ownerId}
                        className="badge bg-primary rounded-pill px-3 py-2"
                      >
                        {owner.name}

                        <button
                          type="button"
                          className="btn btn-sm text-white p-0 ms-2"
                          onClick={() =>
                            handleOwnerChange(
                              ownerId
                            )
                          }
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tags */}
             <div className="col-md-6">
  <Form.Label>Tags</Form.Label>

  <div className="dropdown">
    <button
      type="button"
      className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {form.tags.length === 0
        ? "Select or add tags"
        : `${form.tags.length} tag${
            form.tags.length > 1 ? "s" : ""
          } selected`}
    </button>

    <div
      className="dropdown-menu w-100 p-2"
      style={{
        maxHeight: "280px",
        overflowY: "auto",
      }}
    >
      {/* Add Custom Tag */}
      <div className="mb-2">
        <div className="input-group">
          <Form.Control
            type="text"
            placeholder="Add new tag"
            value={newTag}
            onChange={(e) =>
              setNewTag(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
          />

          <Button
            type="button"
            variant="primary"
            onClick={addCustomTag}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="dropdown-divider"></div>

      {/* Existing Tags */}
      {availableTags.length === 0 ? (
        <div className="text-muted small px-2 py-2">
          No existing tags available
        </div>
      ) : (
        availableTags.map((tag) => (
          <div
            key={tag}
            className="dropdown-item-text"
          >
            <Form.Check
              type="checkbox"
              id={`tag-${tag}`}
              label={tag}
              checked={form.tags.includes(tag)}
              onChange={() =>
                handleTagChange(tag)
              }
            />
          </div>
        ))
      )}
    </div>
  </div>

  {/* Selected Tags */}
  {form.tags.length > 0 && (
    <div className="d-flex flex-wrap gap-2 mt-2">
      {form.tags.map((tag) => (
        <span
          key={tag}
          className="badge bg-secondary rounded-pill px-3 py-2"
        >
          {tag}

          <button
            type="button"
            className="btn btn-sm text-white p-0 ms-2"
            onClick={() =>
              handleTagChange(tag)
            }
          >
            <i className="bi bi-x"></i>
          </button>
        </span>
      ))}
    </div>
  )}
</div>

            {/* Due Date */}
            <div className="col-md-6">
              <Form.Label>
                Due Date
              </Form.Label>

              <Form.Control
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate: e.target.value,
                  })
                }
              />
            </div>

          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Task"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;