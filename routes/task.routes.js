const express = require("express");

const router = express.Router();

const { createTask, getTasks, updateTask, deleteTas} = require("../controllers/task.controller");

const { validateTask, validateTaskUpdate, validateDelete } = require("../middleware/task.middleware");

router.post("/", validateTask, createTask);

router.get("/", getTasks);

router.patch("/:id", validateTaskUpdate, updateTask);

router.delete("/", validateDelete, deleteTasks);

module.exports = router;