const IoC = require('AppIoC');
const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const {
  mutationWithClientMutationId,
} = require('graphql-relay');

/**
 * Create post mutation.
 */
const createPostMutation = (postRepository, postType) => mutationWithClientMutationId({
  name: 'CreatePost',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    slug: { type: GraphQLString },
  },
  outputFields: {
    post: { type: postType },
  },
  mutateAndGetPayload: async (attrs, { viewer }) => {
    const post = await postRepository.create(viewer, attrs);
    return { post };
  }
});

IoC.callable('app.graphQL.createPostMutation', [
  'blog.postRepository',
  'app.graphQL.postType',
], createPostMutation);
