"use strict";
const Task = require("../models/taskModel");

// Create Task

const createTask = async (req, res) => {
  try {
    // 1. Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You must be logged in to create a task",
      });
    }
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while creating the task"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Get all Tasks

// Get Task by ID

// Update Task

// Delete Task

// Export the controller functions
