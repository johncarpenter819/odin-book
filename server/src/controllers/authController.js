const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    dateOfBirth,
    city,
    state,
    phoneNumber,
    bio,
    profilePhotoUrl,
  } = req.body;

  if (!username || !email || !password || !confirmPassword || !dateOfBirth) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and confirm password do not match" });
  }

  try {
    const existingUser = await global.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({ error: "email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await global.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        city: city || null,
        state: state || null,
        phoneNumber: phoneNumber || null,
        bio: bio || "New user.",
        profilePhotoUrl: profilePhotoUrl || "/default-avatar.png",
      },
      select: {
        id: true,
        username: true,
        email: true,
        city: true,
        state: true,
        dateOfBirth: true,
        profilePhotoUrl: true,
      },
    });

    res.status(201).json({
      message: "Registration successful!",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    if (error.message.includes("Date") || error.message.includes("DateTime")) {
      res.status(400).json({
        error:
          "Invalid date format for dateOfBirth. Please use valid format YYYY-MM-DD.",
      });
    } else {
      res.status(500).json({ error: "Failed to register new user." });
    }
  }
};

exports.loginSuccess = (req, res) => {
  if (req.user) {
    const { password, ...user } = req.user;

    res.status(200).json({
      message: "Login successful",
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        profilePhotoUrl: req.user.profilePhotoUrl || "/default-avatar.png",
        city: req.user.city,
        state: req.user.state,
        dateOfBirth: req.user.dateOfBirth,
      },
    });
  } else {
    res
      .status(401)
      .json({ error: "Unauthorized access or missing user session." });
  }
};

exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to logout completely." });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
};
