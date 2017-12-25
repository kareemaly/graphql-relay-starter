const IoC = require('AppIoC');
const express = require('express');
const graphQLHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  addFrontendDevMiddlewares,
  addFrontendProdMiddlewares,
} = require('./utils/frontendMiddleware');
const logger = require('./utils/logger');

const getGraphQlPort = async () => {
  const envConfig = await IoC.resolve('app.envConfig');
  return envConfig.get('GRAPHQL_PORT', 8080);
};

const getAppPort = async () => {
  const envConfig = await IoC.resolve('app.envConfig');
  return envConfig.get('APP_PORT', 3000);
};

const getHost = async () => {
  const envConfig = await IoC.resolve('app.envConfig');
  return envConfig.get('HOST', 'localhost');
};

/**
 * Run frontend application development server.
 *
 * This requires a graphql server running on GRAPHQL_PORT.
 */
async function runRelayDevServer() {
  const relayServer = express();

  // Force registering env. configuration
  require('./config/env');

  const APP_PORT = await getAppPort();
  const GRAPHQL_PORT = await getGraphQlPort();
  const HOST = await getHost();

  addFrontendDevMiddlewares(relayServer, {
    proxy: {
      '/graphql': `http://${HOST}:${GRAPHQL_PORT}`,
      '/api/v1': `http://${HOST}:${GRAPHQL_PORT}`
    },
  });

  relayServer.listen(APP_PORT, HOST, () => {
    logger.appStarted(APP_PORT, HOST);
  });
}

async function configureExpress(expressApp, isProduction) {
  const graphqlSchema = await IoC.resolve('app.graphQL.schema');
  const authMiddleware = await IoC.resolve('auth.authMiddleware');
  const errorMiddleware = await IoC.resolve('app.errorMiddleware');

  const configurePassport = await IoC.resolve('auth.configurePassport');
  const authenticationRoutes = await IoC.resolve('auth.routes');

  const graphQLOptions = {
    development: {
      graphiql: true,
      pretty: true,
      schema: graphqlSchema,
      formatError: (error) => {
        return error.originalError ? error.originalError.toObject() : error.toObject();
      },
    },
    production: {
      schema: graphqlSchema,
      formatError: (error) => {
        return error.originalError ? error.originalError.toObject() : error.toObject();
      },
    },
  };

  //
  expressApp.use(authMiddleware.setViewer.bind(authMiddleware));
  expressApp.use(bodyParser.json());
  expressApp.use(cors());
  //
  configurePassport(expressApp);
  expressApp.use('/api/v1/auth', authenticationRoutes);
  expressApp.use('/graphql', graphQLHTTP(graphQLOptions[isProduction ? 'production': 'development']));

  if (isProduction) {
    addFrontendProdMiddlewares(expressApp);
  }

  expressApp.get('*', (req, res, next) => res.send('404 not found'));

  expressApp.use(errorMiddleware.log.bind(errorMiddleware));
  expressApp.use(errorMiddleware.response.bind(errorMiddleware));
}

/**
 * Run graphql development server.
 */
async function runGraphQLDevServer() {
  // Bootstrap server application
  require('./bootstrap');

  const GRAPHQL_PORT = await getGraphQlPort();
  const HOST = await getHost();

  const expressApp = express();

  // Configure express
  await configureExpress(expressApp, false);

  expressApp.listen(GRAPHQL_PORT, () => {
    logger.graphqlStarted(GRAPHQL_PORT, HOST);
  });
}

/**
 * Running both GraphQL and Frontend applications.
 */
async function runProductionServer() {
  // Bootstrap server application
  require('./bootstrap');

  const HOST = await getHost();

  const expressApp = express();

  // Configure express
  await configureExpress(expressApp, true);

  expressApp.listen(process.env.PORT, () => {
    logger.graphqlStarted(process.env.PORT, HOST);
  });
}

module.exports = {
  runRelayDevServer,
  runGraphQLDevServer,
  runProductionServer,
};
