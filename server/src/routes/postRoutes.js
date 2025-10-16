const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../config/middleware/authMiddleware");

router.get("/feed", authMiddleware.isAuthenticated, postController.getNewsFeed);
router.get(
  "/:postId/comments",
  authMiddleware.isAuthenticated,
  postController.getPostComments
);

router.post("/", authMiddleware.isAuthenticated, postController.createPost);

router.post(
  "/:postId/comments",
  authMiddleware.isAuthenticated,
  postController.createComment
);

module.exports = router;
