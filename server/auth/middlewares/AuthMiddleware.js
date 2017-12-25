const IoC = require('AppIoC');

class AuthMiddleware {
  constructor(tokenManager, stateManager, guestUser) {
    this.tokenManager = tokenManager;
    this.stateManager = stateManager;
    this.guestUser = guestUser;
  }

  /**
   * Assign viewer to the request object
   * @param {Object}   req
   * @param {Object}   res
   * @param {Function} next
   */
  async setViewer(req, res, next) {
    try {
      // Get token from header
      if (req.get('Authorization')) {
        const token = req.get('Authorization').replace('JWT ', '');
        // Get viewer from token
        req.viewer = await this.tokenManager.getViewer(token);
      }

      if (req.query.state) {
        req.viewer = await this.stateManager.getViewer(req.query.state);
      }

      // Use a mocked guest user when not logged in
      if(! req.viewer) {
        req.viewer = this.guestUser;
      }

      next();
      //
    } catch(err) {
      next(err);
    }
  }
}

IoC.singleton('auth.authMiddleware', [
  'auth.tokenManager',
  'auth.stateManager',
  'auth.guestUser',
], AuthMiddleware);
