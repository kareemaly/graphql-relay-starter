const IoC = require('AppIoC');
const passport = require('passport');

const configurePassport = (
  envConfig,
  configureFacebookPassport,
  configureGooglePassport,
  configureLinkedinPassport
) => (expressApp) => {
  //
  expressApp.use(passport.initialize({
    userProperty: 'viewer'
  }));
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  if (!!envConfig.get('FACEBOOK_CLIENT_ID')) {
    configureFacebookPassport();
  }
  if (!!envConfig.get('GOOGLE_CLIENT_ID')) {
    configureGooglePassport();
  }
  if (!!envConfig.get('LINKEDIN_CLIENT_ID')) {
    configureLinkedinPassport();
  }
};

IoC.callable('auth.configurePassport', [
  'app.envConfig',
  'auth.configureFacebookPassport',
  'auth.configureGooglePassport',
  'auth.configureLinkedinPassport',
], configurePassport);
