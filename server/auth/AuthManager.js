const IoC = require('AppIoC');
const ForbiddenError = require('@server/errors/ForbiddenError');
const ValidationError = require('@server/errors/ValidationError');
const UnauthorizedError = require('@server/errors/UnauthorizedError');
const { NORMAL_USER } = require('@server/auth/constants/userTypes');
const { ucfirst } = require('@server/utils/helpers');

/**
 * AuthManager manager
 */
class AuthManager {
  constructor(userRepository, tokenManager, superUser) {
    this.userRepository = userRepository;
    this.tokenManager = tokenManager;
    this.superUser = superUser;
  }

  /**
   * Login user
   */
  async login(currentViewer, email, password) {
    // Get viewer by email
    const viewer = await this.userRepository.getViewer(email, password);
    if(viewer.isGuest()) {
      throw new UnauthorizedError("Entered credentials are incorrect.");
    }
    // Construct token from user
    const token = await this.tokenManager.construct(viewer);
    // Return viewer and token
    return {
      viewer,
      token,
    };
  }

  connectFacebook(currentViewer, attrs) {
    return this.connectProvider(currentViewer, 'facebook', attrs);
  }

  connectTwitter(currentViewer, attrs) {
    return this.connectProvider(currentViewer, 'twitter', attrs);
  }

  connectGoogle(currentViewer, attrs) {
    return this.connectProvider(currentViewer, 'google', attrs);
  }

  connectLinkedin(currentViewer, attrs) {
    return this.connectProvider(currentViewer, 'linkedin', attrs);
  }

  async connectProvider(currentViewer, provider, {
    id,
    token,
    refreshToken,
    email,
    ...attrs
  }) {
    const providerAttrs = {
      id,
      token,
      refreshToken,
      email,
      ...attrs
    };

    const usersWithSameEmail = await this.userRepository.query(this.superUser, { email });

    // There's an already an existing user with that email
    // Update that user and log him in
    if (usersWithSameEmail.length > 0) {
      return this.userRepository.update(this.superUser, usersWithSameEmail[0], {
        [provider]: providerAttrs
      });
    }

    // Not a new user then update the provider
    if (!currentViewer.isGuest()) {
      return this.userRepository.update(this.superUser, currentViewer, {
        [provider]: providerAttrs
      });
    }

    // Create a new user from this provider
    return this.userRepository.create(this.superUser, {
      firstName: attrs.firstName || "New",
      lastName: attrs.lastName || "User",
      displayName: attrs.displayName || AuthManager.getDisplayName(attrs),
      email,
      password: AuthManager.randomPassword(attrs),
      userType: NORMAL_USER,
      [provider]: providerAttrs,
    });
  }

  /**
   * Register user with email and password
   */
  async registerLocal(currentViewer, attrs) {
    // Already registered
    if(! currentViewer.isGuest()) {
      throw new ForbiddenError("You already logged in");
    }

    if(! attrs.email) {
      throw new ValidationError({ email: "Email is required" });
    }

    if(! attrs.password) {
      throw new ValidationError({ email: "Password is required" });
    }

    const defaultAttrs = {
      firstName: 'New',
      lastName: 'User',
      displayName: AuthManager.getDisplayName(attrs),
    };

    // To create user we have to use superUser credentials
    return await this.userRepository.create(this.superUser, {
      ...defaultAttrs,
      ...attrs,
      userType: NORMAL_USER,
    });
  }

  /**
   * Helper method to get display name
   */
  static getDisplayName({ firstName, lastName, email }) {
    if (firstName || lastName) {
      return `${firstName}${ucfirst(lastName)}`;
    }

    return email.slice(0, email.indexOf('@'));
  }

  /**
   * Helper method to generate random password that will get accepted
   */
  static randomPassword() {
    return Math.random().toString(36).substr(2, 7);
  }
}

IoC.singleton('auth.authManager', [
  'auth.userRepository',
  'auth.tokenManager',
  'auth.superUser',
], AuthManager);
