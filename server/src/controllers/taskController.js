import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tasks with Filters
export const getTasks = async (req, res) => {
  try {
    const { project, team, status, owner } = req.query;

    const filter = {};

    if (project) filter.project = project;
    if (team) filter.team = team;
    if (status) filter.status = status;
    if (owner) filter.owners = owner;

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Task
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name description")
      .populate("team", "name description")
      .populate("owners", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};