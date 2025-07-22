const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
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
      select: false, // This will not return the password in queries
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
  },
  { timestamps: true }
);

// Schema Middlewares

// Document middleware to hash passwords before saving

// Pre-save hook
userSchema.pre("save", async function (next) {
  // 1.If the password hasn'r been modified
  if (!this.isModified("password")) return next();

  //   2. Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //   3. Remove the passwordConfirm field from the Database
  this.passwordConfirm = undefined;

  next();
});

// Create the user model
const User = mongoose.model("User", userSchema);

// Export the user model
module.exports = User;
