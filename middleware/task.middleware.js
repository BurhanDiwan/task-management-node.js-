const VALID_PRIORITIES = ["low", "medium", "high"];

const validateTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({ message: "title, description and priority are required" });
  }

  if (typeof title !== "string" || typeof description !== "string") {
    return res.status(400).json({ message: "title and description must be strings" });
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ message: "priority must be low, medium or high" });
  }

  next();
};

const validateTaskUpdate = (req, res, next) => {
  const allowedFields = ["title", "description", "priority", "isCompleted", "dueDate"];
  const receivedFields = Object.keys(req.body);

  if (receivedFields.length === 0) {
    return res.status(400).json({ message: "Please provide at least one field to update" });
  }

  const hasInvalidField = receivedFields.some((field) => !allowedFields.includes(field));
  if (hasInvalidField) {
    return res.status(400).json({ message: `Only these fields are allowed: ${allowedFields.join(", ")}` });
  }

  if (req.body.title !== undefined) {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      return res.status(400).json({ message: "title must be a non-empty string" });
    }
  }

  if (req.body.description !== undefined) {
    if (typeof req.body.description !== "string" || !req.body.description.trim()) {
      return res.status(400).json({ message: "description must be a non-empty string" });
    }
  }

  if (req.body.priority !== undefined) {
    if (!VALID_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({ message: "priority must be low, medium or high" });
    }
  }

  if (req.body.isCompleted !== undefined) {
    if (typeof req.body.isCompleted !== "boolean") {
      return res.status(400).json({ message: "isCompleted must be true or false" });
    }
  }

  next();
};

const validateDelete = (req, res, next) => {
  const { priority } = req.query;

  if (!priority) {
    return res.status(400).json({ message: "priority query parameter is required (e.g. ?priority=high)" });
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ message: "priority must be low, medium or high" });
  }

  next();
};

module.exports = { validateTask, validateTaskUpdate, validateDelete };