const _ = require('lodash');

const mongoose = require('mongoose');
const appConfig = require('./config');

const ENV = "development";
const config = _.get(appConfig, ENV);
const mongoConfig = _.get(config, 'mongodb');

mongoose.connect(mongoConfig.connectionString, mongoConfig.options)
  .then(() => console.log('Connected.'))
  .catch(() => console.log('Connection to db error timed out'));
mongoose.set('debug', true);
module.exports = mongoose;
