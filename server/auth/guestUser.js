const IoC = require('AppIoC');
const { GUEST_USER } = require('@server/auth/constants/userTypes');

/**
 * Guest user.
 *
 * Mocking user model to use if not logged in to have expected behavior
 * in all our app.
 */
const guestUser = (userModel) => {
  const guest = new userModel();
  guest.set({
    firstName: 'Guest',
    lastName: 'User',
    displayName: 'Guest User',
    userType: GUEST_USER,
  });
  return guest;
};

IoC.callable('auth.guestUser', [
  'auth.userModel'
], guestUser);
