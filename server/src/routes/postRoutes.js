const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../config/middleware/authMiddleware");

router.get("/feed", authMiddleware.isAuthenticated, postController.getNewsFeed);
router.post("/", authMiddleware.isAuthenticated, postController.createPost);

module.exports = router;
