import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../services/api";
import toast from "react-hot-toast";

const EditTaskModal = ({ show, handleClose, task, onUpdated }) => {
  const [form, setForm] = useState({
    name: "",
    status: "To Do",
    dueDate: "",
    timeToComplete: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: task.name || "",
        status: task.status || "To Do",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        timeToComplete: task.timeToComplete || 1,
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.put(`/tasks/${task._id}`, form);

      toast.success("Task updated successfully");
      onUpdated(data);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Blocked</option>
              <option>Completed</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Estimated Days</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.timeToComplete}
              onChange={(e) =>
                setForm({
                  ...form,
                  timeToComplete: Number(e.target.value),
                })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditTaskModal;