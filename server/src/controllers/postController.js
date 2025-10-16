const { tr } = require("@faker-js/faker");
const { connect } = require("../routes/authRoutes");

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
    console.error("Error fetching news feed.");
  }
};

exports.createPost = async (req, res) => {
  const { content, mediaUrl } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Post content is required." });
  }

  const authorId = req.user.id;

  try {
    const newPost = await global.prisma.post.create({
      data: {
        content,
        mediaUrl: mediaUrl || null,
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
    const newComment = await global.prisma.comment.create({
      data: {
        content: content.trim(),
        author: { connect: { id: authorId } },
        post: { connect: { id: postId } },
      },
      select: {
        id: true,
        content: true,
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

    res.status(201).json(newComment);
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
    const comments = await global.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
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

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};
