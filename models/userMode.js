const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [
      true,
      "A user with this name already exists, pls choose another username",
    ],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
});
