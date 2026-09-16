const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true
    },

    isCompleted: {
      type: Boolean,
      default: false
    },

    completionDate: {
      type: Date,
      default: null
    },

    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;