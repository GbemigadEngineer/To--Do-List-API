const express = require("express");
const protect = require("../middleware/authMiddleware");
const { updateUser, deleteUser } = require("../controllers/userController");

// Create a new router instance
const router = express.Router();

// User routes

router.route("/updateuser").patch(protect, updateUser);
router.route("/deleteuser").delete(protect, deleteUser);

// Export the router
module.exports = router;
