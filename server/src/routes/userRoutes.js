const express = require("express");
const {
  getUserProfile,
  getAllUsers,
  toggleFollow,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.get("/username/:username", getUserProfile);

router.post("/:userId/follow", toggleFollow);

module.exports = router;
