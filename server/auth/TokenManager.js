const IoC = require('AppIoC');

/**
 * Facade class to login user using tokens
 */
class TokenManager {
  constructor(userRepository, superUser, jwtEncoderDecoder) {
    this.userRepository = userRepository;
    this.superUser = superUser;
    this.jwtEncoderDecoder = jwtEncoderDecoder;
  }

  /**
   * Get viewer from token
   * @param  {string} token
   * @return {User}
   */
  async getViewer(token) {
    const viewerId = await this.getViewerId(token);
    if(viewerId) {
      return this.userRepository.findById(this.superUser, viewerId);
    }
  }

  /**
   * Get viewer id from token
   * @param  {string} token
   * @return {string}
   */
  async getViewerId(token) {
    if(! token) {
      return;
    }
    // Decode token
    const decoded = await this.jwtEncoderDecoder.decode(token);
    // Get viewerId from decoded token object
    if(decoded) {
      return decoded.viewerId;
    }
  }

  /**
   * Construct token from viewer
   * @param  {User} viewer
   * @return {string}
   */
  async construct(viewer) {
    if(!viewer || !viewer._id) {
      return;
    }
    // Create token from viewer id
    return this.jwtEncoderDecoder.encode({
      viewerId: viewer._id,
    })
  }
}

IoC.singleton('auth.tokenManager', [
  'auth.userRepository',
  'auth.superUser',
  'auth.jwtEncoderDecoder',
], TokenManager);
