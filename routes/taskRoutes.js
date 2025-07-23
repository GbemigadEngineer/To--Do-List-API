"use strict";

const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
} = require("../controllers/taskController");

// Create a new router instance
const router = express.Router();

// Routes for tasks

router.route("/").post(protect, createTask).get(protect, getAllTasks);

router.route("/:id").get(protect, getTask).patch(protect, updateTask);

// Export the router
module.exports = router;
