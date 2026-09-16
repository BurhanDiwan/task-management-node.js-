const mongoose = require("mongoose");
const Task = require("../models/task.model.js");

const createTask = async (req, res) => {
  try {
    const { title, description, priority, isCompleted, dueDate } = req.body;

    const existingTask = await Task.findOne({ title });

    if (existingTask) {
      return res.status(400).json({
        message: "Task title already exists"
      });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      isCompleted: isCompleted ?? false,
      dueDate: dueDate ?? null,
      completionDate: isCompleted === true ? new Date() : null
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      error: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { priority, status } = req.query;

    const filter = {};

    if (priority) {
      if (!["low", "medium", "high"].includes(priority)) {
        return res.status(400).json({
          message: "Priority must be low, medium or high"
        });
      }

      filter.priority = priority;
    }

    if (status) {
      if (status === "completed") {
        filter.isCompleted = true;
      } else if (status === "pending") {
        filter.isCompleted = false;
      } else {
        return res.status(400).json({
          message: "Status must be completed or pending"
        });
      }
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving tasks",
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID"
      });
    }

    const updateData = {};

    const allowedFields = [ "title", "description", "priority", "isCompleted", "dueDate" ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (req.body.isCompleted === true) {
      updateData.completionDate = new Date();
    }

    if (req.body.isCompleted === false) {
      updateData.completionDate = null;
    }

    if (req.body.title !== undefined) {
      const existingTask = await Task.findOne({
        title: req.body.title,
        _id: { $ne: id }
      });

      if (existingTask) {
        return res.status(400).json({
          message: "Task title already exists"
        });
      }
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating task",
      error: error.message
    });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;

    const result = await Task.deleteMany({
      priority
    });

    res.status(200).json({
      message: "Tasks deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting tasks",
      error: error.message
    });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTasks };