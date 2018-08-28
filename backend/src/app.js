'use strict';

// [START debug]
// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start();
  require('@google-cloud/debug-agent').start();
}
// [END debug]

const path = require('path');
const express = require('express');
const passport = require('passport');
const config = require('./config');
const logging = require('./logging');

const app = express();

app.disable('etag');
app.set('trust proxy', true);

// Add the request logger before anything else so that it can
// accurately log requests.
// [START requests]
app.use(logging.requestLogger);
// [END requests]

// Configure the session and session storage.
app.use(require('./session').router);

// OAuth2
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', require('./user').router);
app.use('/api/doc', require('./document').router);

// Static files
app.use('/', express.static(path.join(__dirname, '../www')));

// Add the error logger after all middleware and routes so that
// it can log errors from the whole application. Any custom error
// handlers should go after this.
// [START errors]
app.use(logging.errorLogger);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res, next) => {
  /* jshint unused:false */
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});
// [END errors]

if (module === require.main) {
  // Start the server
  const server = app.listen(config.get('PORT'), () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
