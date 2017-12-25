import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import Grid from 'app/components/Blog/Main/Grid';

const PostItem = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const PostImage = styled.div`
  background: url('${(props) => props.src}');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 150px;
`;

const PostName = styled.h3`
`;

const PostsGrid = ({ posts, onPostClick }) => (
  <Grid
    itemsPerRow={{
      mobile: 1,
      tablet: 2,
      desktop: 3,
    }}
  >
    {posts.edges.map((edge) => (
      <PostItem
        onClick={() => onPostClick(edge.node.id)}
        key={edge.node.id}
      >
        <PostImage
          src={edge.node.coverImage}
        />
        <PostName>{edge.node.name}</PostName>
      </PostItem>
    ))}
  </Grid>
);

PostsGrid.propTypes = {
  posts: PropTypes.shape({
    edges: PropTypes.arrayOf(PropTypes.shape({
      node: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        coverImage: PropTypes.string,
      }).isRequired,
    })).isRequired,
  }).isRequired,
  onPostClick: PropTypes.func.isRequired,
};

export default createFragmentContainer(
  PostsGrid,
  graphql`
    fragment PostsGrid_posts on PostConnection {
      edges {
        node {
          id
          name
          coverImage
        }
      }
    }
  `
);
