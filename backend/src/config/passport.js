const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const avatar = profile.photos[0].value;
        const firstname = profile.name.givenName;
        const name = profile.name.familyName;

        // Vérifier si l'utilisateur existe déjà
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // Mettre à jour le googleId si pas encore lié
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { email },
              data: { googleId, avatar },
            });
          }
        } else {
          // Créer un nouveau compte
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

module.exports = passport;