const IoC = require('AppIoC');
const jwt = require('jsonwebtoken');

class JwtEncoderDecoder {
  constructor(envConfig) {
    this.envConfig = envConfig;
  }

  /**
   * Get secret key from env.
   * @return {string}
   */
  __getSecretKey() {
    const secretKey = this.envConfig.get('SECRET_KEY');

    if(! secretKey) {
      throw new Error("JwtEncoderDecoder needs SECRET_KEY env. variable to be defined");
    }

    return secretKey;
  }

  /**
   * Jwt encode
   * @param  {object} data
   * @return {string} token
   */
  encode(data) {
    return jwt.sign(data, this.__getSecretKey());
  }

  /**
   * Jwt decode token
   * @param  {string} token
   * @return {object}
   */
  decode(token) {
    return jwt.decode(token, this.__getSecretKey());
  }
}

IoC.singleton('auth.jwtEncoderDecoder', [
  'app.envConfig',
], JwtEncoderDecoder);
