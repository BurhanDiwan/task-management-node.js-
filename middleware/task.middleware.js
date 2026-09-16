const validateTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  if ( !title || !description || !priority || typeof title !== "string" || typeof description !== "string" ) {
    return res.status(400).json({
      message: "Incomplete Data Received"
    });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({
      message: "Priority must be low, medium or high"
    });
  }

  next();
};

const validateTaskUpdate = (req, res, next) => {
  const allowedFields = [ "title", "description", "priority", "isCompleted", "dueDat" ];

  const fields = Object.keys(req.body);

  if (fields.length === 0) {
    return res.status(400).json({
      message: "Incomplete Data Received"
    });
  }

  const invalidField = fields.some(
    (field) => !allowedFields.includes(field)
  );

  if (invalidField) {
    return res.status(400).json({
      message: "Invalid field"
    });
  }

  if (
    req.body.title !== undefined &&
    (typeof req.body.title !== "string" || !req.body.title.trim())
  ) {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  if (
    req.body.description !== undefined &&
    (typeof req.body.description !== "string" ||
      !req.body.description.trim())
  ) {
    return res.status(400).json({
      message: "Description is required"
    });
  }

  if (
    req.body.priority !== undefined &&
    !["low", "medium", "high"].includes(req.body.priority)
  ) {
    return res.status(400).json({
      message: "Priority must be low, medium or high"
    });
  }

  if (
    req.body.isCompleted !== undefined &&
    typeof req.body.isCompleted !== "boolean"
  ) {
    return res.status(400).json({
      message: "isCompleted must be true or false"
    });
  }

  next();
};

const validateDelete = (req, res, next) => {
  const { priority } = req.query;

  if (!priority) {
    return res.status(400).json({
      message: "Priority query parameter is required"
    });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({
      message: "Priority must be low, medium or high"
    });
  }

  next();
};

module.exports = { validateTask, validateTaskUpdate, validateDelete };