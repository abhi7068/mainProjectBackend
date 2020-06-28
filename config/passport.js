var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const keys = require('./keys');
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '923434802962-cbk2cf86krhsvt6ehgke4scnnvg890bu.apps.googleusercontent.com',
      clientSecret: 'Y7ygeuQPdB_aufmjCI3izmj2',
      callbackURL: `${keys.SERVER_URI}/google/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      var userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
      };

      done(null, userData);
    }
  )
);
