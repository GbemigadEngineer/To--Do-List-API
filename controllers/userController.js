"use strict";

const User = require("../models/userModel");

// Update user controller

const updateUser = async (req, res) => {
  try {
    // 1. Get the User ID from the protect middleware
    const userID = req.user.id;

    // 2. get the updated data from the request body

    // 2a. Ensure that only the allowed fields are updated
    const allowedFields = ["username", "email"];

    const filteredBody = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    // 3. Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userID, filteredBody, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated fields
    });

    // 4. Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found!",
      });
    }
    // 5. Send Response
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while updating the user"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // 1. Get the User ID from the protect middleware
    const userID = req.user.id;
    // 2. Get the password and passwordConfirm from the request body
    const { password, passwordConfirm } = req.body;

    // 3. Validate the input
    if (!password || !passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Password and password confirmation are required",
      });
    }

    // 4.  If Validation Passed Delete the user from the database
    const deletedUser = await User.findByIdAndUpdate(
      userID,
      { deletedAt: Date.now(), isActive: false }, // Soft delete by setting deletedAt and isActive
      { new: true, runValidators: true }
    );

    // 3. Check if the user was found and deleted
    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found!",
      });
    }

    // 4. Send Response
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while deleting the user"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

module.exports = {
  updateUser,
  deleteUser,
};
