const mongoose = require("mongoose");

// Create task Schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A task must have a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "No description provided",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A task must belong to a user"],
      select: false, // This will not return the password in queries
    },
  },
  {
    timestamps: true,
  }
);

// Create Task Model

const Task = mongoose.model("Task", taskSchema);

// Export the Task model
module.exports = Task;
