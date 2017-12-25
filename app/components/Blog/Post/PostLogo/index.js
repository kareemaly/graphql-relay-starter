import React from 'react';
import styled from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';

const Image = styled.img`
  width: 60px;
`;

const PostLogo = ({ post }) => (
  <Image
    src={post.logoImage}
  />
);

PostLogo.propTypes = {
  post: PropTypes.shape({
    logoImage: PropTypes.string,
  }).isRequired,
};

export default createFragmentContainer(
  PostLogo,
  graphql`
    fragment PostLogo_post on Post {
      logoImage
    }
  `
);
