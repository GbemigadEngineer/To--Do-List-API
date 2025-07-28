const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: "Please provide a valid email address",
      },
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

    // New field for soft delete
    deletedAt: {
      type: Date,
      default: null, // Default to null, meaning not deleted
    },
    // You might also add an 'isActive' flag for quick checks
    isActive: {
      type: Boolean,
      default: true, // Default to true, meaning active
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Schema methods
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; //15 minutes

  return resetToken; //this token would be sent via email
};

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
