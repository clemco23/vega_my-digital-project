const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");

const hasGoogleAuthConfig = Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

if (hasGoogleAuthConfig) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:3000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const googleId = profile.id;
          const avatar = profile.photos?.[0]?.value || null;
          const firstname = profile.name.givenName;
          const name = profile.name.familyName;

          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            const dataToUpdate = {};

            if (!user.googleId) {
              dataToUpdate.googleId = googleId;
            }

            if (avatar && avatar !== user.avatar) {
              dataToUpdate.avatar = avatar;
            }

            if (Object.keys(dataToUpdate).length > 0) {
              user = await prisma.user.update({
                where: { email },
                data: dataToUpdate,
              });
            }
          } else {
            user = await prisma.user.create({
              data: {
                email,
                googleId,
                avatar,
                firstname,
                name: name || "Inconnu",
                verifiedAt: new Date(),
              },
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn(
    "Google OAuth desactive : GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET manquant."
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.hasGoogleAuthConfig = hasGoogleAuthConfig;

module.exports = passport;
