"use strict";
const Task = require("../models/taskModel");

// Create Task

const createTask = async (req, res) => {
  try {
    // 1. Check if user is logged in from the protect middleware request object.
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "You must be logged in to create a task",
      });
    }

    // 2. Extract task data from the request body
    const { title, description, status } = req.body;

    // 3. Validate the data
    if (!title) {
      return res.status(400).json({
        status: "fail",
        message: "A task must have a title",
      });
    }

    // 4. Create a new task
    const newTask = await Task.create({
      title,
      description,
      status,
      date: new Date(),
      user: req.user.id, // Use the user ID from the request object
    });

    // 5. Send response
    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });
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
module.exports = {
  createTask,
};
