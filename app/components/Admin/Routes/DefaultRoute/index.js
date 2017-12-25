import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { QueryRenderer, graphql } from 'react-relay';
import relayEnvironment from 'app/config/relay';
import PageError from 'app/components/Common/PageError';
import PageLoader from 'app/components/Common/PageLoader';
import DashboardLayout from 'app/components/Admin/Main/DashboardLayout';
import Link from 'app/components/Admin/Main/Link';
import Paper from 'app/components/Admin/Main/Paper';
import Grid from 'app/components/Blog/Main/Grid';
import TagIcon from 'app/components/Blog/Icons/TagIcon';

const Box = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
`;

const BoxIconWrapper = styled.div`
  margin-right: 10px;
`;

const BoxTitle = styled.h2`
`;

class DefaultRoute extends React.Component {
  static propTypes = {
    viewer: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  componentWillMount() {
    // Not an admin so we need to change route
    if (!this.props.viewer.isAdmin) {
      this.props.history.replace('/admin/login');
    }
  }

  render() {
    const {
      viewer,
    } = this.props;

    const iconSize = 60;

    return (
      <DashboardLayout viewer={viewer}>
        <Paper paddings={['left', 'right']} zDepth={0}>
          <Grid
            itemsPerRow={{
              largeDesktop: 4,
              desktop: 3,
              tablet: 2,
              mobile: 1,
            }}
          >
            <Box to="/admin/posts">
              <BoxIconWrapper>
                <TagIcon width={iconSize} height={iconSize} />
              </BoxIconWrapper>
              <BoxTitle>
                Posts
              </BoxTitle>
            </Box>
          </Grid>
        </Paper>
      </DashboardLayout>
    );
  }
}

export default (props) => (
  <QueryRenderer
    environment={relayEnvironment}
    query={graphql`
      query DefaultRouteQuery {
        viewer {
          firstName
          isAdmin
          ...DashboardLayout_viewer
        }
      }
    `}
    render={({ error, props: relayProps }) => {
      if (error) {
        return <PageError error={error} />;
      }

      if (relayProps) {
        return <DefaultRoute {...relayProps} {...props} />;
      }

      return <PageLoader />;
    }}
  />
);
