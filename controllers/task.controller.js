const mongoose = require("mongoose");
const Task = require("../models/task.model.js");

const createTask = async (req, res) => {
  try {
    const { title, description, priority, isCompleted, dueDate } = req.body;

    const titleAlreadyExists = await Task.findOne({ title });
    if (titleAlreadyExists) {
      return res.status(400).json({ message: "A task with this title already exists" });
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
      message: "Something went wrong while creating the task",
      error: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { priority, status } = req.query;

    const filter = {};

    if (priority) {
      filter.priority = priority;
    }

    if (status === "completed") {
      filter.isCompleted = true;
    } else if (status === "pending") {
      filter.isCompleted = false;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while fetching tasks",
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "The provided task ID is not valid" });
    }

    const allowedFields = ["title", "description", "priority", "isCompleted", "dueDate"];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (req.body.isCompleted === true) {
      updateData.completionDate = new Date();
    } else if (req.body.isCompleted === false) {
      updateData.completionDate = null;
    }

    if (req.body.title !== undefined) {
      const titleTakenByAnotherTask = await Task.findOne({
        title: req.body.title,
        _id: { $ne: id }
      });

      if (titleTakenByAnotherTask) {
        return res.status(400).json({ message: "Another task already has this title" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "No task found with that ID" });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while updating the task",
      error: error.message
    });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;

    const result = await Task.deleteMany({ priority });

    res.status(200).json({
      message: `All ${priority} priority tasks deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleting tasks",
      error: error.message
    });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTasks };