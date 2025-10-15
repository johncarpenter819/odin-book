const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await global.prisma.user.findUnique({
            where: { email },
          });
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const userId = parseInt(id, 10);

    if (isNaN(userId) || userId <= 0) {
      return done(null, false);
    }
    try {
      const user = await global.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          profilePhotoUrl: true,
          bio: true,
          city: true,
          state: true,
        },
      });
      done(null, user || false);
    } catch (err) {
      done(err);
    }
  });
};
