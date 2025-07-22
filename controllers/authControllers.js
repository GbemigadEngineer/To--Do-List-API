"use strict";

// Import necessary modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

const login = async (req, res) => {
  try {
    // 1. Get the user data from the req.body
    const { username, password } = req.body;

    // 2. Validate the data
    // 2a. Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Username and password are required",
      });
    }

    // 2b. Check if the user exists and if the password is correct
    const user = await User.findOne({ username }).select("+password");

    // 2ci. If the user does not exist or the password is incorrect return error message
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid username or password",
      });
    }
    // ps i'm using this error message so an hacker doesn't know if the username or password is wrong

    // 3. If the user exists and the password is correct, generate a jwt token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. Send the response with the token and user data

    //4a. Send token to the response as a cookie
    res.cookie("loginToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure to true in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // 4b. Send the response with the user data and token

    const userToken = process.env.NODE_ENV === "production" ? "" : token;
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token: userToken,
      data: {
        user: {
          id: user._id,
          username: user.username,
        },
      },
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while logging in"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Export the controller functions
module.exports = {
  signup,
  login,
};
