"use strict";

// Import necessary modules
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Signup controller

const signup = async (req, res) => {
  try {
    // 1. Extract username and password from the request body
    const { username, password, passwordConfirm } = req.body;
    // 2. Validate the input
    if (!username || !password || !passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Username, password and password confirmation are required",
      });
    }
    // 3. If validation passes, createa new user
    const newUser = await User.create({ username, password, passwordConfirm });

    // 4.Send response

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });

    // Check if the user already exists
    const existingUser = await User.find;
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while signing up"
        : console.log(error.message);

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};



// Export the controller functions
module.exports = {
  signup,
};


