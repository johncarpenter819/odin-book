exports.getUserProfile = async (req, res) => {
  const identifier = req.params.username;

  const currentUserId = req.user ? req.user.id : null;

  try {
    const profileUser = await global.prisma.user.findUnique({
      where: { username: identifier },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePhotoUrl: true,
        city: true,
        state: true,
        createdAt: true,
        dateOfBirth: true,
        sex: true,
        phoneNumber: true,
        _count: {
          select: { followedBy: true, following: true },
        },
        followedBy: currentUserId
          ? {
              where: { followerId: currentUserId },
              select: { followerId: true },
            }
          : false,

        posts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: { id: true, username: true, profilePhotoUrl: true },
            },
            likes: { select: { authorId: true } },
            comments: { select: { id: true } },
          },
        },
      },
    });

    if (!profileUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const isFollowedByCurrentUser = profileUser.followedBy
      ? profileUser.followedBy.length > 0
      : false;

    const { followedBy, ...userData } = profileUser;

    const finalProfile = {
      ...userData,
      isFollowedByCurrentUser,
    };

    res.status(200).json(finalProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

exports.getAllUsers = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication is required." });
  }
  const currentUserId = req.user.id;

  try {
    const users = await global.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
      select: {
        id: true,
        username: true,
        profilePhotoUrl: true,
        followedBy: {
          where: { followerId: currentUserId },
          select: { id: true },
        },
      },
    });

    const usersWithFollowStatus = users.map((user) => ({
      id: user.id,
      username: user.username,
      profilePhotoUrl: user.profilePhotoUrl,
      isFollowing: user.followedBy.length > 0,
    }));

    res.status(200).json(usersWithFollowStatus);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

exports.toggleFollow = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const followerId = req.user.id;
  const followingId = parseInt(req.params.userId, 10);

  if (isNaN(followingId) || followerId === followingId) {
    return res
      .status(400)
      .json({ error: "Invalid user ID or self-follow attempt." });
  }

  try {
    const existingFollow = await global.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    let action;

    if (existingFollow) {
      await global.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      });
      action = "unfollowed";
    } else {
      await global.prisma.follow.create({
        data: {
          followerId: followerId,
          followingId: followingId,
        },
      });
      action = "followed";
    }

    res.status(200).json({ action });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ error: "Failed to toggle follow status." });
  }
};

exports.updateUserProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const userIdToUpdate = req.user.id;
  const { bio, city, state, profilePhotoUrl } = req.body;

  try {
    const updatedUser = await global.prisma.user.update({
      where: { id: userIdToUpdate },
      data: {
        bio,
        city,
        state,
        profilePhotoUrl,
      },
      select: {
        id: true,
        username: true,
        bio: true,
        profilePhotoUrl: true,
        city: true,
        state: true,
        createdAt: true,
        dateOfBirth: true,
        sex: true,
        phoneNumber: true,
        _count: {
          select: { followedBy: true, following: true },
        },
        followedBy: {
          where: { followerId: userIdToUpdate },
          select: { followerId: true },
        },
      },
    });

    const isFollowedByCurrentUser = updatedUser.followedBy
      ? updatedUser.followedBy.length > 0
      : false;

    const { followedBy, ...userData } = updatedUser;

    const finalProfile = {
      ...userData,
      isFollowedByCurrentUser,
    };

    res.status(200).json(finalProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
};
