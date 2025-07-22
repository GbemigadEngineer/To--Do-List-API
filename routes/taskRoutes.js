"use strict";

const express = require("express");
const taskController = require("../controllers/taskControllers");
const protect = require("../middleware/authMiddleware");

// Create a new router instance
const router = express.Router();

// Routes for tasks

router.routes("/");

// Export the router
module.exports = router;
