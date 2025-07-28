"use strict";
const mongoose = require("mongoose");
const Task = require("../models/taskModel");

// Create Task

const createTask = async (req, res) => {
  try {
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
const getAllTasks = async (req, res) => {
  try {
    // 1. Get the status query parameter if provided
    const { status } = req.query;

    // 2. Validate status if provided

    const allowedStatuses = ["pending", "completed"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Invalid status provided. Allowed values are 'pending' or 'completed'.",
      });
    }
    // 3. Build query object

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }
    // 4. Fetch tasks from the database
    const tasks = await Task.find(query);

    // 5. send response
    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while fetching tasks"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Get Task by ID

const getTask = async (req, res) => {
  try {
    // 1. Check if the user is logged in
    if (!req.user) {
      res.status(401).json({
        status: "fail",
        message: "You must be logged in to view a task",
      });
    }
    // 2. Get the task ID from the request parameters
    const taskId = req.params.id;

    // 3. Check if it is a valid mongoose ObjectId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        status: "fail",
        message: "A valid task ID is required",
      });
    }

    // 4. Get the task with the given ID from the databse
    const task = await Task.findById(taskId);

    // 5. Send response
    res.status(200).json({
      status: "success",
      data: {
        task,
      }, 
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while fetching the task"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    //2. Get the task ID from the request parameters
    const taskId = req.params.id;

    // 3. Check if it is a valid mongoose ObjectId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        status: "fail",
        message: "A valid task ID is required",
      });
    }
    // 4. Get the updated data from the request body

    // 4a. Ensure that only allowed fields are updated
    const allowedFields = ["title", "description", "status"];

    const filteredBody = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );
    // 5. Update the task in the database
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      { new: true, runValidators: true }
    );

    // 6. Check if the task was found and updated
    if (!updateTask) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found!",
      });
    }

    // 7. Send response
    res.status(200).json({
      status: "success",
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while updating the task"
        : error.message;
    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Delete Task

const deleteTask = async (req, res) => {
  try {
    // 2. Get the task ID from the request parameters
    const taskId = req.params.id;

    // 3. Check if it is a valid mongoose ObjectId
    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        status: "fail",
        message: "A valid task ID is required",
      });
    }
    // 4. Delete the task from the database
    const deletedTask = await Task.findByIdAndDelete(taskId);
    // 5. Check if the task was found and deleted
    if (!deletedTask) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found!",
      });
    }
    // 6. Send response
    res.status(204).json({
      status: "success",
      message: "Task deleted successfully",
      data: null,
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while deleting the task"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Export the controller functions
module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
};
