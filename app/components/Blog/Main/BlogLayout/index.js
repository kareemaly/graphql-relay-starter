import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { createFragmentContainer, graphql } from 'react-relay';
import Header from 'app/components/Blog/Main/Header';
import Footer from 'app/components/Blog/Main/Footer';
import Paper from 'app/components/Blog/Main/Paper';
import AdminFooter from 'app/components/Blog/Main/AdminFooter';

const PageWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  margin-bottom: 60px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #EEE;
`;

class BlogLayout extends React.Component {
  componentWillMount() {
    this.setState({
      adminFooterOpened: true,
    });
  }

  render() {
    const {
      children,
      history,
      viewer,
      adminFooterContent,
    } = this.props;

    const {
      adminFooterOpened,
    } = this.state;

    return (
      <PageWrapper>
        <Header
          onHomeClick={() => history.push('/')}
          onAboutClick={() => history.push('/about')}
          onPostsClick={() => history.push('/posts')}
          onAdminClick={() => history.push('/admin')}
        />
        <Divider />
        <ContentWrapper>
          {children}
        </ContentWrapper>
        <Divider />
        <Paper paddings={['top', 'bottom', 'left', 'right']}>
          <Footer
            onHomeClick={() => history.push('/')}
            onAboutClick={() => history.push('/about')}
            onPostsClick={() => history.push('/posts')}
          />
        </Paper>
        {
          viewer.isAdmin && adminFooterContent &&
          <AdminFooter
            opened={adminFooterOpened}
            onOpen={() => this.setState({ adminFooterOpened: true })}
            onClose={() => this.setState({ adminFooterOpened: false })}
            viewer={viewer}
          >
            {adminFooterContent}
          </AdminFooter>
        }
      </PageWrapper>
    );
  }
}

BlogLayout.propTypes = {
  history: PropTypes.object.isRequired,
  viewer: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  adminFooterContent: PropTypes.any,
};

export default createFragmentContainer(
  withRouter(BlogLayout),
  graphql`
    fragment BlogLayout_viewer on User {
      isAdmin
      ...AdminFooter_viewer
    }
  `
);
