const FacebookStrategy = require('passport-facebook').Strategy;
const IoC = require('AppIoC');
const passport = require('passport');

const configureFacebookPassport = (envConfig, authManager) => () => {
  passport.use(new FacebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID : envConfig.get('FACEBOOK_CLIENT_ID'),
    clientSecret : envConfig.get('FACEBOOK_CLIENT_SECRET'),
    callbackURL : envConfig.get('FACEBOOK_CALLBACK_URL'),
    profileFields: ['id', 'displayName', 'name', 'emails'],
    scope: ['public_profile', 'email'],
    passReqToCallback: true,
  },

  // facebook will send back the token and profile
  (req, token, refreshToken, profile, done) => {
    // asynchronous
    process.nextTick(async () => {
      const attrs = {};

      attrs.id = profile.id;
      attrs.token = token;
      attrs.refreshToken = refreshToken;

      attrs.displayName = profile.displayName;

      if (profile.name) {
        attrs.firstName = profile.name.givenName;
        attrs.lastName = profile.name.familyName;
      }

      if (profile.emails && profile.emails.length > 0) {
        attrs.email = (profile.emails[0].value || '').toLowerCase();
      }

      // if there is no user found with that facebook id, create them
      try {
        const viewer = await authManager.connectFacebook(req.viewer, attrs);
        done(null, viewer);
      } catch(err) {
        done(err);
      }
    });
  }));
};

IoC.callable('auth.configureFacebookPassport', [
  'app.envConfig',
  'auth.authManager',
], configureFacebookPassport);
