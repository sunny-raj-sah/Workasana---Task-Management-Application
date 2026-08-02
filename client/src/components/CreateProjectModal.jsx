import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import api from "../services/api";
import { useApp } from "../context/AppContext";

const CreateProjectModal = ({ show, handleClose }) => {
  const { dispatch } = useApp();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/projects", form);

      dispatch({ type: "ADD_PROJECT", payload: data });

      toast.success("Project created successfully");

      setForm({ name: "", description: "" });
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter project description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;