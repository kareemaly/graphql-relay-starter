const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
} = require('graphql');

const IoC = require('AppIoC');

const graphqlSchema = (
  nodeField,

  // User
  userType,
  loginUserMutation,
  registerUserMutation,

  // Post
  createPostMutation,
  updatePostMutation,
  removePostMutation,
  postsResolver
) => {
  /**
   * Construct schema (query and mutation)
   *
   * query: root query has only the viewer
   * mutation: all available mutations in our application
   */
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        node: nodeField,
        viewer: {
          type: new GraphQLNonNull(userType),
          // Resolve viewer from request
          // @see auth/middlewares/AuthMiddleware
          resolve: (parent, args, req) => req.viewer,
        },
        posts: postsResolver,
      }),
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => ({
        // User mutations
        loginUser: loginUserMutation,
        registerUser: registerUserMutation,
        // Post Mutations
        createPost: createPostMutation,
        updatePost: updatePostMutation,
        removePost: removePostMutation,
      })
    }),
  });
};

IoC.callable('app.graphQL.schema', [
  'app.graphQL.nodeField',
  // User
  'app.graphQL.userType',
  'app.graphQL.loginUserMutation',
  'app.graphQL.registerUserMutation',

  // Post
  'app.graphQL.createPostMutation',
  'app.graphQL.updatePostMutation',
  'app.graphQL.removePostMutation',
  'app.graphQL.postsResolver',
], graphqlSchema);
