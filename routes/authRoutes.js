const express = require("express");
const { signup } = require("../controllers/authControllers");

// Create a new router instance
const router = express.Router();

// routes
router.route("/signup").post(signup);

// Expport the router to be used in other files
module.exports = router;
