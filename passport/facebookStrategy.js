const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
    },
    (accessToken, refreshToken, profile, next) => {
      console.log(profile);
      User.findOne({ facebookId: profile.id })
        .then(user => {
          if (user) return next(null, user);
          return User.create({ facebookId: profile.id }).then(user => {
            return next(null, user);
          });
        })
        .catch(error => console.log(error));
    }
  )
);
