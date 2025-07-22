const express = require("express");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

// importing modules
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Create an instance of an Express application
const app = express();

// Middlewares

// Body parser middleware to parse JSON requests
app.use(express.json());

// Logger middleware for logging requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Cookie parser middleware
app.use(cookieParser());

//Router Middlewares
// Mounting the auth routes
app.use("/api/v1/todo", authRoutes);
// Mounting the task routes
app.use("/api/v1/todo/tasks", taskRoutes);

// Export the app for use in other files
module.exports = app;
