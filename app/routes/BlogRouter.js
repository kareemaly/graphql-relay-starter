import React from 'react';
import { ThemeProvider } from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Switch, Route } from 'react-router-dom';
import defaultTheme from 'app/themes/default';

import PostsRoute from 'app/components/Blog/Routes/PostsRoute';
import PostRoute from 'app/components/Blog/Routes/PostRoute';
import HomeRoute from 'app/components/Blog/Routes/HomeRoute';
import AboutRoute from 'app/components/Blog/Routes/AboutRoute';
import FontsRoute from 'app/components/Blog/Routes/FontsRoute';

export default () => (
  <ThemeProvider theme={defaultTheme}>
    <MuiThemeProvider theme={defaultTheme}>
      <Switch>
        {/* Home Route */}
        <Route
          exact
          path="/"
          component={HomeRoute}
        />
        {/* List posts Route */}
        <Route
          path="/posts"
          component={PostsRoute}
        />
        {/* Show post Route */}
        <Route
          exact
          path="/post/:postId"
          component={PostRoute}
        />

        {/* Show about  Route */}
        <Route
          exact
          path="/about"
          component={AboutRoute}
        />

        <Route
          exact
          path="/fonts"
          component={FontsRoute}
        />
      </Switch>
    </MuiThemeProvider>
  </ThemeProvider>
);
