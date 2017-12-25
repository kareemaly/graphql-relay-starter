const IoC = require('AppIoC');
const validate = require('mongoose-validator');

class UserValidator {
  email() {
    return validate({
      validator: 'isEmail',
      message: `Incorrect email format`,
    });
  }
}

IoC.singleton('auth.userValidator', [
], UserValidator);

