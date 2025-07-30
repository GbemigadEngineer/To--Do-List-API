const express = require("express");

const morgan = require("morgan");

const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit");

// importing modules
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

// Create an instance of an Express application

const app = express();

// Basic rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable deprecated headers
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again in 15 minutes",
  },
});

// Middlewares

// Apply to all routes for limiting requests
app.use(limiter);

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
app.use("/api/v1/auth", authRoutes);
// Mounting the task routes
app.use("/api/v1/todo/tasks", taskRoutes);
// Mounting the user router
app.use("/api/v1/todo/user", userRoutes);

// Export the app for use in other files
module.exports = app;
