"use strict";
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    // 1. Check for the token in the cookies

    const token = req.cookies.loginToken;

    // 2. Validate the token
    // 2a. If no token is found, return an error
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2b. Verify the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Set the user in the request object
    req.user = decoded;

    // 4. Call the next middleware
    next();
  } catch (error) {
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred while protecting the route"
        : error.message;

    res.status(500).json({
      status: "error",
      message: message,
    });
  }
};

// Export the protect middleware
module.exports = protect;
