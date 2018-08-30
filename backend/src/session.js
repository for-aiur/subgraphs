'use strict';

const session = require('express-session');
const MemcachedStore = require('connect-memjs')(session);
const config = require('./config');

// Configure the session and session storage.
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: config.get('SECRET'),
  signed: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
};

// In production use the Memcache instance to store session data,
// otherwise fallback to the default MemoryStore in development.
if (config.get('NODE_ENV') === 'production' && config.get('MEMCACHE_URL')) {
  if (config.get('MEMCACHE_USERNAME') && (config.get('MEMCACHE_PASSWORD'))) {
    sessionConfig.store = new MemcachedStore({
      servers: [config.get('MEMCACHE_URL')],
      username: config.get('MEMCACHE_USERNAME'),
      password: config.get('MEMCACHE_PASSWORD')});
  } else {
    sessionConfig.store = new MemcachedStore({
      servers: [config.get('MEMCACHE_URL')]});
  }
}

module.exports = {
  router: session(sessionConfig)
};
