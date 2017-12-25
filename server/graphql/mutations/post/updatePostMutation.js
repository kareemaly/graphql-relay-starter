const IoC = require('AppIoC');
const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const {
  mutationWithClientMutationId,
  fromGlobalId,
} = require('graphql-relay');

/**
 * Update post mutation.
 */
const updatePostMutation = (postRepository, postType) => mutationWithClientMutationId({
  name: 'UpdatePost',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    slug: { type: GraphQLString },
    coverImage: { type: GraphQLString },
    logoImage: { type: GraphQLString },
  },
  outputFields: {
    post: { type: postType },
  },
  mutateAndGetPayload: async ({ id, ...attrs }, { viewer }) => {
    const { id: postId } = fromGlobalId(id);
    const post = await postRepository.update(viewer, postId, attrs);
    return { post };
  }
});

IoC.callable('app.graphQL.updatePostMutation', [
  'blog.postRepository',
  'app.graphQL.postType',
], updatePostMutation);
