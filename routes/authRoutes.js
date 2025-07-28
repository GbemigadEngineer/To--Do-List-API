const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");

// Create a new router instance
const router = express.Router();

// routes
router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

// Expport the router to be used in other files
module.exports = router;
