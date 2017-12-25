const IoC = require('AppIoC');
const {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const {
  fromGlobalId,
  mutationWithClientMutationId,
} = require('graphql-relay');

/**
 * Remove post mutation.
 */
const removePostMutation = (postRepository) => mutationWithClientMutationId({
  name: 'RemovePost',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    deleted: { type: GraphQLBoolean },
    deletedId: { type: GraphQLString },
  },
  mutateAndGetPayload: async ({ id }, { viewer }) => {
    const { id: postId } = fromGlobalId(id);
    await postRepository.remove(viewer, postId);
    return { deletedId: id, deleted: true };
  }
});

IoC.callable('app.graphQL.removePostMutation', [
  'blog.postRepository'
], removePostMutation);
