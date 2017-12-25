import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const ListPosts = ({ posts, onRemovePost, onEditPost }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Tools</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {posts.edges.map((edge) => (
        <TableRow key={edge.node.id}>
          <TableRowColumn>{edge.node.name}</TableRowColumn>
          <TableRowColumn>
            <RaisedButton
              primary
              onClick={() => {
                onEditPost(edge.node.id);
              }}
              label={'Edit'}
            />
            <RaisedButton
              secondary
              onClick={() => {
                onRemovePost(edge.node.id);
              }}
              label={'Delete'}
            />
          </TableRowColumn>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

ListPosts.propTypes = {
  posts: PropTypes.shape({
    edges: PropTypes.arrayOf(PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  onEditPost: PropTypes.func.isRequired,
  onRemovePost: PropTypes.func.isRequired,
};

export default createFragmentContainer(
  ListPosts,
  graphql`
    fragment ListPosts_posts on PostConnection {
      edges {
        node {
          id
          name
        }
      }
    }
  `
);
