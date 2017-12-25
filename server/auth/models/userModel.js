const IoC = require('AppIoC');
const Q = require('q');
const validator = require('validator');
const { Schema } = require('mongoose');
const passwordHash = require('password-hash-and-salt');
const uniqueValidator = require('mongoose-unique-validator');
const { checkEqualIds } = require('@server/utils/mongo');
const {
  GUEST_USER,
  NORMAL_USER,
  ADMIN_USER,
} = require('@server/auth/constants/userTypes');
const ValidationError = require('@server/errors/ValidationError');

const userModel = (mongoose, userValidator) => {
  const supportedUserTypes = [
    GUEST_USER,
    NORMAL_USER,
    ADMIN_USER,
  ];

  const providerSchema = {
    id: {type: String},
    token: {type: String},
    refreshToken: {type: String},
    email: {type: String},
  };

  /**
   * User schema definition.
   * @type {Schema}
   */
  const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    displayName: {type: String, required: true},
    email: {type: String, required: true, validate: userValidator.email(), unique: true},
    // This attribute is the hashed password (the actual password is never saved)
    password: {type: String, required: true},
    // Used to separate different types of users and give access to certain APIs
    userType: {type: String, enum: supportedUserTypes, required: true},
    facebook: providerSchema,
    twitter: providerSchema,
    google: providerSchema,
    linkedin: providerSchema,
  });

  /**
   * Check if this user is of type.
   * @param  {string} type
   * @return {boolean}
   */
  userSchema.method('checkUserType', function(type) {
    return this.userType === type;
  });

  /**
   * Check if user is guest.
   * @return {boolean}
   */
  userSchema.method('isGuest', function() {
    return this.checkUserType(GUEST_USER);
  });

  /**
   * Check if user is a normal user.
   * This user has access to normal actions on the application.
   * @return {boolean}
   */
  userSchema.method('isNormal', function() {
    return this.checkUserType(NORMAL_USER);
  });

  /**
   * Check if user is admin.
   * Admin users have access to CMS actions.
   * @return {boolean}
   */
  userSchema.method('isAdmin', function() {
    return this.checkUserType(ADMIN_USER);
  });

  /**
   * Getter for user email.
   * @return  {string}
   */
  userSchema.method('getEmail', function() {
    return this.email;
  });

  /**
   * Getter for user first name.
   * @return  {string}
   */
  userSchema.method('getFirstName', function() {
    return this.firstName;
  });

  /**
   * Getter for user last name.
   * @return  {string}
   */
  userSchema.method('getLastName', function() {
    return this.lastName;
  });

  /**
   * Getter for user display name.
   * @return  {string}
   */
  userSchema.method('getDisplayName', function() {
    return this.displayName;
  });

  /**
   * Check if the same user
   * @param {ObjectId|UserModel} user
   * @return {boolean} true if the same user
   */
  userSchema.method('same', function(user) {
    return checkEqualIds(user, this._id);
  });

  /**
   * Hash user password
   * @param {string} password user input password
   */
  userSchema.method('hashPassword', async function(password) {
    if(!validator.isLength(password, { min: 6, max: 25 })) {
      throw new ValidationError({
        password: 'Password length must be between 6 and 25 characters',
      });
    }
    this.password = await Q.ninvoke(passwordHash(password), 'hash');
  });

  /**
   * Check if password is correct
   * @param {string} password
   * @return {boolean} whether password is correct or not
   */
  userSchema.method('verifyPassword', async function(password) {
    if(! password) {
      return false;
    }

    return Q.ninvoke(passwordHash(password), 'verifyAgainst', this.password);
  });

  /**
   * Pre save middleware
   * - Hash password if it has been modified
   * @param {Function} next
   */
  userSchema.pre('save', async function(next) {
    try {
      if (this.isModified('password')) {
        await this.hashPassword(this.password);
      }
      next();
    } catch(err) {
      next(err);
    }
  });

  userSchema.plugin(uniqueValidator);

  return mongoose.model('User', userSchema);
};

IoC.callable('auth.userModel', [
  'app.connection',
  'auth.userValidator',
], userModel);
