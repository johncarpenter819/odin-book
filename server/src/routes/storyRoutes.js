const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");
const authMiddleware = require("../config/middleware/authMiddleware");

router.get("/", authMiddleware.isAuthenticated, storyController.getStories);

module.exports = router;
