const IoC = require('AppIoC');
const passport = require('passport');
const { Router } = require('express');
const { getReferrer, addQueryParams } = require('@server/utils/url');

const socialRoutes = (envConfig, stateManager, tokenManager) => {
  const socialRouter = Router();

  const providerCallback = async (req, res, next) => {
    const issuer = await stateManager.getIssuer(req.query.state);
    const token = await tokenManager.construct(req.viewer);

    res.redirect(addQueryParams(issuer, { token }));
  };

  if (!!envConfig.get('FACEBOOK_CLIENT_ID')) {
    // Routes for facebook
    socialRouter.get('/facebook', async (req, res, next) => {
      const state = await stateManager.construct(req.viewer, getReferrer(req));
      //
      passport.authenticate('facebook', {
        state,
      })(req, res, next);
    });

    socialRouter.get('/facebook/callback', passport.authenticate('facebook'), providerCallback);
  }

  if (!!envConfig.get('GOOGLE_CLIENT_ID')) {
    // Routes for google
    socialRouter.get('/google', async (req, res, next) => {
      const state = await stateManager.construct(req.viewer, getReferrer(req));
      //
      passport.authenticate('google', {
        state,
      })(req, res, next);
    });

    socialRouter.get('/google/callback', passport.authenticate('google'), providerCallback);
  }

  if (!!envConfig.get('LINKEDIN_CLIENT_ID')) {
    // Routes for linkedin
    socialRouter.get('/linkedin', async (req, res, next) => {
      const state = await stateManager.construct(req.viewer, getReferrer(req));
      //
      passport.authenticate('linkedin', {
        state,
      })(req, res, next);
    });

    socialRouter.get('/linkedin/callback', passport.authenticate('linkedin'), providerCallback);
  }

  return socialRouter;
};

IoC.callable('auth.socialRoutes', [
  'app.envConfig',
  'auth.stateManager',
  'auth.tokenManager',
], socialRoutes);
