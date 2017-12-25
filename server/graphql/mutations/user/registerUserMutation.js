const IoC = require('AppIoC');
const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const {
  mutationWithClientMutationId,
} = require('graphql-relay');

/**
 * Register user mutation.
 *
 * Create new user in our database
 */
const registerUserMutation = (authManager, userType) => mutationWithClientMutationId({
  name: 'RegisterUser',
  inputFields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    viewer: { type: userType },
  },
  mutateAndGetPayload: async (attrs, context) => {
    // Register user
    const viewer = await authManager.registerLocal(context.viewer, attrs);
    // Return token and viewer
    return {
      viewer,
    };
  }
});

IoC.callable('app.graphQL.registerUserMutation', [
  'auth.authManager',
  'app.graphQL.userType',
], registerUserMutation);
