const IoC = require('AppIoC');
const mongoose = require('mongoose');
const Q = require('q');

// Mongodb connection
const connection = async () => {
  // For backwards compatibility, Mongoose 4 returns mpromise promises by default.
  // Plugging in your own Promises Library (i.e.: Q.Promise)
  mongoose.Promise = Q.Promise;
  return await mongoose.createConnection(process.env.MONGODB_URI);
};

// Register connection
IoC.callable('app.connection', [], connection);
