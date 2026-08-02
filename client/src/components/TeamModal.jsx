import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../services/api";
import toast from "react-hot-toast";

const TeamModal = ({ show, handleClose, team, onSaved }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: team.name || "",
        description: team.description || "",
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [team, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Team name is required");
      return;
    }

    try {
      setLoading(true);

      let data;

      if (team) {
        const res = await api.put(`/teams/${team._id}`, form);
        data = res.data;
        toast.success("Team updated");
      } else {
        const res = await api.post("/teams", form);
        data = res.data;
        toast.success("Team created");
      }

      onSaved(data, !!team);
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{team ? "Edit Team" : "Create Team"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Frontend Team"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What does this team work on?"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : team ? "Update Team" : "Create Team"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TeamModal;