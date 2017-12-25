import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import relayEnvironment from 'app/config/relay';
import PageError from 'app/components/Common/PageError';
import PageLoader from 'app/components/Common/PageLoader';
import BlogLayout from 'app/components/Blog/Main/BlogLayout';
import PostsGrid from 'app/components/Blog/Post/PostsGrid';
import Paper from 'app/components/Blog/Main/Paper';

const PostsRoute = ({
  posts,
  history,
  viewer,
}) => (
  <BlogLayout
    viewer={viewer}
  >
    <Paper paddings={['top', 'bottom', 'left', 'right']}>
      <h1>All posts</h1>
      <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.</p>
    </Paper>
    <Paper paddings={['top', 'bottom', 'left', 'right']}>
      <PostsGrid
        posts={posts}
        onPostClick={(id) => history.push(`post/${id}`)}
      />
    </Paper>
  </BlogLayout>
);

PostsRoute.propTypes = {
  viewer: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

export default (props) => (
  <QueryRenderer
    environment={relayEnvironment}
    query={graphql`
      query PostsRouteQuery {
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
        return <PostsRoute {...props} {...relayProps} />;
      }

      return <PageLoader />;
    }}
  />
);
