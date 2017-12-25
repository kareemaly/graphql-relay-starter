const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const IoC = require('AppIoC');
const passport = require('passport');

const configureGooglePassport = (envConfig, authManager) => () => {
  passport.use(new GoogleStrategy({
    // pull in our app id and secret from our auth.js file
    clientID : envConfig.get('GOOGLE_CLIENT_ID'),
    clientSecret : envConfig.get('GOOGLE_CLIENT_SECRET'),
    callbackURL : envConfig.get('GOOGLE_CALLBACK_URL'),
    profileFields: ['id', 'displayName', 'name', 'emails'],
    scope: ['profile', 'email'],
    passReqToCallback: true,
  },

  // google will send back the token and profile
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

      // if there is no user found with that google id, create them
      try {
        const viewer = await authManager.connectGoogle(req.viewer, attrs);
        done(null, viewer);
      } catch(err) {
        done(err);
      }
    });
  }));
};

IoC.callable('auth.configureGooglePassport', [
  'app.envConfig',
  'auth.authManager',
], configureGooglePassport);
