const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const morgan = require("morgan");

// importing modules
const authRoutes = require("./routes/authRoutes");

// Create an instance of an Express application
const app = express();

// Middlewares

// Body parser middleware to parse JSON requests
app.use(express.json());

// Logger middleware for logging requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Router Middlewares
// Mounting the auth routes
app.use("/api/v1/todo", authRoutes);
// Mounting the task routes
app.use("api/v1/todo/tasks", taskRoutes);

// Export the app for use in other files
module.exports = app;
