'use strict';

// Hierarchical node.js configuration with command-line arguments, environment
// variables, and files.
const nconf = module.exports = require('nconf');
const path = require('path');

nconf
  // 1. Command-line arguments
  .argv()
  // 2. Environment variables
  .env([
    'GCLOUD_PROJECT',
    'MEMCACHE_URL',
    'MEMCACHE_USERNAME',
    'MEMCACHE_PASSWORD',
    'INSTANCE_CONNECTION_NAME',
    'NODE_ENV',
    'OAUTH2_CLIENT_ID',
    'OAUTH2_CLIENT_SECRET',
    'OAUTH2_CALLBACK',
    'PORT',
    'SECRET'
  ])
  // 3. Config file
  .file({ file: path.join(__dirname, 'config.json') })
  // 4. Defaults
  .defaults({
    // This is the id of your project in the Google Cloud Developers Console.
    GCLOUD_PROJECT: 'subgraphs-web',

    OAUTH2_CLIENT_ID: '235897629498-v1sfl9g078vsfju5pghrpkq4m615dv9t.apps.googleusercontent.com',
    OAUTH2_CLIENT_SECRET: '8UZbPfa4z_Q2o-uR4sweSD5l',
    OAUTH2_CALLBACK: 'http://localhost:8080/api/user/auth/google/callback',

    PORT: 8080,

    // Set this a secret string of your choosing
    SECRET: 'ArkhamCity'
  });

// Check for required settings
checkConfig('GCLOUD_PROJECT');
checkConfig('OAUTH2_CLIENT_ID');
checkConfig('OAUTH2_CLIENT_SECRET');

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error(`You must set ${setting} as an environment variable or in config.json!`);
  }
}
