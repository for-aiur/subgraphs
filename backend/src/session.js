'use strict';

const session = require('express-session');
const Datastore = require('@google-cloud/datastore');
const DatastoreStore = require('@google-cloud/connect-datastore')(session);
const config = require('./config');

const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  },
  store: new DatastoreStore({
    dataset: Datastore({
      projectId: config.get('GCLOUD_PROJECT'),
      prefix: 'express-sessions'
    })
  })
};

module.exports = {
  router: session(sessionConfig)
};
