const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/task.routes");

const app = express();

app.use(express.json());

connectDB();

app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Advanced Task Management System API is running"
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});