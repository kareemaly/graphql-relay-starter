const glob = require('glob');
const path = require('path');

const registeredDirectories = [
  'auth',
  'blog',
  'config',
  'errors',
  'graphql',
  'middlewares',
  'utils',
];

// Require all files to register themselves
glob.sync( path.join(__dirname, `./@(${registeredDirectories.join('|')})/**/*.js`) ).forEach( function( file ) {
  require( path.resolve( file ) );
});
