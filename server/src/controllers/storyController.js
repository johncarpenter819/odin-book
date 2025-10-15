exports.getStories = async (req, res) => {
  try {
    const stories = await global.prisma.story.findMany({
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
      },
      take: 5,
    });

    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories." });
  }
};
