const LinkedinStrategy = require('passport-linkedin-oauth2').OAuth2Strategy;
const IoC = require('AppIoC');
const passport = require('passport');

const configureLinkedinPassport = (envConfig, authManager) => () => {
  passport.use(new LinkedinStrategy({
    // pull in our app id and secret from our auth.js file
    clientID : envConfig.get('LINKEDIN_CLIENT_ID'),
    clientSecret : envConfig.get('LINKEDIN_CLIENT_SECRET'),
    callbackURL : envConfig.get('LINKEDIN_CALLBACK_URL'),
    profileFields: ['id', 'displayName', 'name', 'emails'],
    scope: ['r_emailaddress', 'r_basicprofile'],
    passReqToCallback: true,
  },

  // linkedin will send back the token and profile
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

      // if there is no user found with that linkedin id, create them
      try {
        const viewer = await authManager.connectLinkedin(req.viewer, attrs);
        done(null, viewer);
      } catch(err) {
        done(err);
      }
    });
  }));
};

IoC.callable('auth.configureLinkedinPassport', [
  'app.envConfig',
  'auth.authManager',
], configureLinkedinPassport);
