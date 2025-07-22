const express = require("express");
const { signup, login } = require("../controllers/authControllers");

// Create a new router instance
const router = express.Router();

// routes
router.route("/signup").post(signup);

router.route("/login").post(login);

// Expport the router to be used in other files
module.exports = router;
