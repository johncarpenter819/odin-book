const { tr, da } = require("@faker-js/faker");
const { connect } = require("../routes/authRoutes");
const { act } = require("react");
const { text } = require("express");

exports.getNewsFeed = async (req, res) => {
  try {
    const posts = await global.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            profilePhotoUrl: true,
          },
        },
        likes: {
          select: {
            authorId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
      take: 20,
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching news feed.", error);
    res.status(500).json({ error: "Failed to load feed data" });
  }
};

exports.createPost = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ error: "Authentication is required to create a post" });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Post content is required." });
  }

  const authorId = parseInt(req.user.id, 10);

  try {
    const newPost = await global.prisma.post.create({
      data: {
        content,
        author: {
          connect: { id: authorId },
        },
      },
      include: {
        author: {
          select: { id: true, username: true, profilePhotoUrl: true },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
};

exports.createComment = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "You must be logged in to comment." });
  }

  const { content } = req.body;
  const postId = parseInt(req.params.postId, 10);
  const authorId = req.user.id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content cannot be empty." });
  }
  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid Post ID." });
  }

  try {
    const createdComment = await global.prisma.comment.create({
      data: {
        text: content.trim(),
        author: { connect: { id: authorId } },
        post: { connect: { id: postId } },
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    const newCommentResponse = {
      ...createdComment,
      content: createdComment.text,
    };
    delete newCommentResponse.text;

    res.status(201).json(newCommentResponse);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Failed to post comment." });
  }
};

exports.getPostComments = async (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid Post ID." });
  }

  try {
    const rawComments = await global.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePhotoUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const comments = rawComments.map((comment) => ({
      id: comment.id,
      content: comment.text,
      createdAt: comment.createdAt,
      author: comment.author,
    }));

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

exports.toggleLike = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ error: "You must be logged in to like a post." });
  }

  const postId = parseInt(req.params.postId, 10);
  const authorId = req.user.id;

  if (isNaN(postId)) {
    return res.status(400).json({ error: "Invalid Post ID." });
  }

  try {
    const existingLike = await global.prisma.like.findUnique({
      where: {
        authorId_postId: {
          authorId: authorId,
          postId: postId,
        },
      },
    });

    let updatedPost;

    if (existingLike) {
      await global.prisma.like.delete({
        where: {
          authorId_postId: {
            authorId: authorId,
            postId: postId,
          },
        },
      });

      updatedPost = await global.prisma.post.findUnique({
        where: { id: postId },
        select: { likes: { select: { authorId: true } } },
      });
      return res
        .status(200)
        .json({ action: "unliked", likes: updatedPost.likes });
    } else {
      await global.prisma.like.create({
        data: {
          author: { connect: { id: authorId } },
          post: { connect: { id: postId } },
        },
      });

      updatedPost = await global.prisma.post.findUnique({
        where: { id: postId },
        select: { likes: { select: { authorId: true } } },
      });
      return res
        .status(200)
        .json({ action: "liked", likes: updatedPost.likes });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Failed to toggle post like." });
  }
};
