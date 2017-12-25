const IoC = require('AppIoC');
const { ADMIN_USER } = require('@server/auth/constants/userTypes');

/**
 * Super user.
 *
 * Mocking user model to use if we want to make operations internally with no restrictions.
 */
const superUser = (userModel) => {
  const superUser = new userModel();
  superUser.set({
    firstName: 'Super',
    lastName: 'User',
    userType: ADMIN_USER,
  });
  return superUser;
};

IoC.callable('auth.superUser', [
  'auth.userModel'
], superUser);
