const IoC = require('AppIoC');

/**
 * This class is responsible for getting data from state and for constructing state
 */
class StateManager {
  constructor(userRepository, superUser, jwtEncoderDecoder) {
    this.userRepository = userRepository;
    this.superUser = superUser;
    this.jwtEncoderDecoder = jwtEncoderDecoder;
  }

  async getViewer(state) {
    const { viewerId } = await this.demolish(state);
    return this.userRepository.findById(this.superUser, viewerId);
  }

  async getIssuer(state) {
    const { iss } = await this.demolish(state);
    return iss;
  }

  async construct(viewer, iss) {
    return this.jwtEncoderDecoder.encode({
      viewerId: viewer._id,
      iss,
    });
  }

  async demolish(state) {
    return this.jwtEncoderDecoder.decode(state);
  }
}

IoC.singleton('auth.stateManager', [
  'auth.userRepository',
  'auth.superUser',
  'auth.jwtEncoderDecoder',
], StateManager);
