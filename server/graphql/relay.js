const {
  fromGlobalId,
  nodeDefinitions,
} = require('graphql-relay');

const IoC = require('AppIoC');

const relayNodeDefinitions = (
  userRepository,
  postRepository
) => {

  const resolveGlobalId = (globalId, { viewer }) => {
    const { type, id } = fromGlobalId(globalId);

    switch(type) {
      case 'User':
        return userRepository.findById(viewer, id);
      case 'Post':
        return postRepository.findById(viewer, id);
    }
  };

  /**
   * We get the node interface and field from the Relay library.
   *
   * The first method defines the way we resolve an ID to its object.
   * The second defines the way we resolve an object to its GraphQL type.
   */
  return nodeDefinitions(
    resolveGlobalId
  );
};

IoC.callable('app.graphQL.relayNodeDefinitions', [
  'auth.userRepository',
  'blog.postRepository',
], relayNodeDefinitions);

IoC.callable('app.graphQL.nodeInterface', [
  'app.graphQL.relayNodeDefinitions'
], ({ nodeInterface }) => nodeInterface);

IoC.callable('app.graphQL.nodeField', [
  'app.graphQL.relayNodeDefinitions'
], ({ nodeField }) => nodeField);
