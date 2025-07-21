"use strict";

const { json } = require("express");

// Signup controller

const signup = (req, res) => {
  console.log("Signup request received:");
  res.send({
    status: "success",
    message: "User signed up successfully",
    data: {
      user: req.body, // Assuming req.body contains user data
    },
  });
};

// Export the controller functions
module.exports = {
  signup,
};
