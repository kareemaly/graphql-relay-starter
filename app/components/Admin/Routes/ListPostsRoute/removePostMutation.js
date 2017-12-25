import {
  commitMutation,
  graphql,
} from 'react-relay';
import relayEnvironment from 'app/config/relay';

const mutation = graphql`
  mutation removePostMutation(
    $input: RemovePostInput!
  ) {
    removePost(input: $input) {
      deletedId
    }
  }
`;

const updater = (id, recordSelector) => {
  const postsRecord = recordSelector.getRoot().getLinkedRecord('posts');

  // Get linked edges
  const edges = postsRecord.getLinkedRecords('edges');

  // Remove edge by matching node ids
  const newEdges = edges.filter((edge) => edge.getLinkedRecord('node').getDataID() !== id);

  // Update posts record with the new edges after the deletion
  postsRecord.setLinkedRecords(newEdges, 'edges');
};

export default (id, onCompleted, onError) => {
  const variables = {
    input: { id },
  };

  commitMutation(
    relayEnvironment,
    {
      mutation,
      variables,
      onCompleted,
      onError,
      updater: (relaySource) => updater(id, relaySource),
    },
  );
};
