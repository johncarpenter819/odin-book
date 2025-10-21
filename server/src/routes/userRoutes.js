const express = require("express");
const {
  getUserProfile,
  getAllUsers,
  toggleFollow,
} = require("../controllers/userController");

const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/username/:username", getUserProfile);

router.post("/:userId/follow", toggleFollow);
router.put("/profile", userController.updateUserProfile);

module.exports = router;
