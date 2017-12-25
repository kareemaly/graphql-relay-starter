import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { QueryRenderer, graphql } from 'react-relay';
import relayEnvironment from 'app/config/relay';
import PageError from 'app/components/Common/PageError';
import PageLoader from 'app/components/Common/PageLoader';
import BlogLayout from 'app/components/Blog/Main/BlogLayout';
import PostHero from 'app/components/Blog/Post/PostHero';
import Button from 'app/components/Blog/Main/Button';
import Paper from 'app/components/Blog/Main/Paper';

const SmallDivider = styled.div`
  width: 100px;
  height: 1px;
  background: #000;
  opacity: 0.1;
  margin: 0 auto;
`;

class PostRoute extends React.Component {
  static propTypes = {
    node: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    const {
      node: post,
      viewer,
      history,
    } = this.props;

    return (
      <BlogLayout
        viewer={viewer}
        adminFooterContent={
          <Button primary onClick={() => history.push(`/admin/post/${post.id}`)}>
            Edit post
          </Button>
        }
      >
        <PostHero
          post={post}
        />
        {
          post.description &&
          <Paper paddings={['top', 'left', 'right']}>
            <p>{post.description}</p>
            <SmallDivider />
          </Paper>
        }
      </BlogLayout>
    );
  }
}

export default (props) => (
  <QueryRenderer
    environment={relayEnvironment}
    query={graphql`
      query PostRouteQuery($postId: ID!) {
        node(id: $postId) {
          id
          ... on Post {
            description
          }
          ...PostHero_post
        }

        viewer {
          ...BlogLayout_viewer
        }
      }
    `}
    variables={{
      postId: props.match.params.postId, // eslint-disable-line react/prop-types
    }}
    render={({ error, props: relayProps }) => {
      if (error) {
        return <PageError error={error} />;
      }

      if (relayProps) {
        return (
          <PostRoute {...props} {...relayProps} />
        );
      }

      return <PageLoader />;
    }}
  />
);
