const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectPgSimple = require("connect-pg-simple");
const pgSession = connectPgSimple(session);

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const app = express();

const { PrismaClient } = require("./generated/prisma");
global.prisma = new PrismaClient();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../client/public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,

    store: new pgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./src/config/passport")(passport);

const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./src/routes/postRoutes");
const userRoutes = require("./src/routes/userRoutes");
const storyRoutes = require("./src/routes/storyRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/auth/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Social Media API is working." });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${port}`
  );
});

process.on("beforeExit", async () => {
  await global.prisma.$disconnect();
});
