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
