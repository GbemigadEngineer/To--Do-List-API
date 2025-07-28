"use strict";

// Import necessary modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const { sendResetEmail } = require("../utils/email");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Signup controller

const signup = async (req, res) => {
  try {
    // 1. Extract username and password from the request body
    const { username, email, password, passwordConfirm } = req.body;
    // 2. Validate the input
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Username, password and password confirmation are required",
      });
    }
    // 3. If validation passes, createa new user
    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    // 4.Send response

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
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

// forgot password

const forgotPassword = async (req, res) => {
  // 1. Get user based on email in req.body

  const user = await User.findOne({ email: req.body.email });
  //2. Validate the email

  if (!user) {
    return res.status(404).json({
      message: "No user found with that email!",
    });
  }

  // 3. If validation passed Generate token, hash, and send the hashed token to the user
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 4. Send token to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request to: ${resetURL}`;

  try {
    await sendResetEmail({
      email: user.email,
      message,
    });

    res.status(200).json({ message: "Token sent to email" });
  } catch (error) {
    user.passwordResetToken = user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error(error);
    res
      .status(500)
      .json({ message: "There was an error sending the email" }, error);
  }
};

// Reset Password

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    //1. Find user by token + check expiry
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    //2. Validate the user
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid orr has expired" });
    }

    //3. If the validation is passed, set new password to the usr from the req.body
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // 4. Clear the rest token field back to their default
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 5. Log the user in imediately i.e send new login token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6. SEND RESPONSE
    res.status(200).json({
      message: "Password reset successful",
      token,
    });
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while resetting the password"
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
  forgotPassword,
  resetPassword,
};
