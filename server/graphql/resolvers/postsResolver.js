const IoC = require('AppIoC');
const {
  GraphQLString,
} = require('graphql');
const {
  connectionArgs,
  connectionFromPromisedArray,
  connectionDefinitions,
} = require('graphql-relay');

/**
 * Resolve posts.
 */
const postsResolver = (postRepository, postType) => ({
  type: connectionDefinitions({ nodeType: postType }).connectionType,
  args: {
    // Relay search args
    ...connectionArgs,
    // Our custom search criteria goes here
    slug: { type: GraphQLString },
  },
  resolve: (_, { slug, ...args }, { viewer }) => connectionFromPromisedArray(
    postRepository.query(viewer, { slug }),
    args
  ),
});

IoC.callable('app.graphQL.postsResolver', [
  'blog.postRepository',
  'app.graphQL.postType',
], postsResolver);
