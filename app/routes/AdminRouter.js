import React from 'react';
import { ThemeProvider } from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Switch, Route } from 'react-router-dom';
import defaultTheme from 'app/themes/default';

import DefaultRoute from 'app/components/Admin/Routes/DefaultRoute';

import ListPostsRoute from 'app/components/Admin/Routes/ListPostsRoute';
import EditPostRoute from 'app/components/Admin/Routes/EditPostRoute';
import CreatePostRoute from 'app/components/Admin/Routes/CreatePostRoute';

import LoginRoute from 'app/components/Admin/Routes/LoginRoute';

export default () => (
  <ThemeProvider theme={defaultTheme}>
    <MuiThemeProvider muiTheme={getMuiTheme(defaultTheme)}>
      <Switch>
        {/* Login Route */}
        <Route
          path="/admin/login"
          component={LoginRoute}
        />

        {/* Default Route */}
        <Route
          exact
          path="/admin"
          component={DefaultRoute}
        />

        {/* List posts Route */}
        <Route
          path="/admin/posts"
          component={ListPostsRoute}
        />
        {/* Create post Route */}
        <Route
          exact
          path="/admin/post/create"
          component={CreatePostRoute}
        />
        {/* Edit post Route */}
        <Route
          exact
          path="/admin/post/:postId"
          component={EditPostRoute}
        />

      </Switch>
    </MuiThemeProvider>
  </ThemeProvider>
);
