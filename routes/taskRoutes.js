"use strict";

const express = require("express");

const protect = require("../middleware/authMiddleware");
const { createTask } = require("../controllers/taskController");

// Create a new router instance
const router = express.Router();

// Routes for tasks

router.route("/").post(protect, createTask).get(protect, );

// Export the router
module.exports = router;
