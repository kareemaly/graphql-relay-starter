import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { QueryRenderer, graphql } from 'react-relay';
import relayEnvironment from 'app/config/relay';
import PageError from 'app/components/Common/PageError';
import PageLoader from 'app/components/Common/PageLoader';
import Paper from 'app/components/Blog/Main/Paper';
import BlogLayout from 'app/components/Blog/Main/BlogLayout';
import PostsGrid from 'app/components/Blog/Post/PostsGrid';

const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SmallDivider = styled.div`
  width: 60px;
  height: 1px;
  background: #000;
  opacity: 0.2;
`;

const SectionTitle = ({ children }) => (
  <SectionTitleWrapper>
    <h2>{children}</h2>
    <SmallDivider />
  </SectionTitleWrapper>
);

SectionTitle.propTypes = {
  children: PropTypes.any.isRequired,
};

const Hero = styled.div`
  background: url('${(props) => props.src}');
  background-position: center;
  background-size: cover;
  height: calc(100vh - ${(props) => props.theme.headerHeight}px);
`;

const HomeRoute = ({
  posts,
  history,
  viewer,
}) => (
  <BlogLayout
    viewer={viewer}
  >
    <Paper paddings={['top', 'bottom', 'left', 'right']}>
      <PostsGrid
        posts={posts}
        onPostClick={(id) => history.push(`post/${id}`)}
      />
    </Paper>
  </BlogLayout>
);

HomeRoute.propTypes = {
  viewer: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

export default (props) => (
  <QueryRenderer
    environment={relayEnvironment}
    query={graphql`
      query HomeRouteQuery {
        posts {
          ...PostsGrid_posts
        }
        viewer {
          ...BlogLayout_viewer
        }
      }
    `}
    render={({ error, props: relayProps }) => {
      if (error) {
        return <PageError error={error} />;
      }

      if (relayProps) {
        return <HomeRoute {...props} {...relayProps} />;
      }

      return <PageLoader />;
    }}
  />
);
