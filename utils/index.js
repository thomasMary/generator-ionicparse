'use strict';
var _ = require('lodash');

module.exports = {
  greeting: require('./greeting'),
  plugins: require('./plugins'),
  starters: require('./starters'),
  auth: require('./auth.js'),
  routes: require('./routes.js'),
  push: require('./push.js'),
  analytics: require('./analytics.js'),
  images: require('./images.js'),
  models: require('./models.js'),
  grunt: require('./gruntfile.js'),
  constants: require('./constants.js'),
  compass: require('./compass.js')
};

function mergeCollections(arr1, arr2, prop) {
  _.forEach(arr2, function (item2) {
    var item1 = _.find(arr1, function (lookAt1) {
      return lookAt1[prop] === item2[prop];
    });

    if (item1) {
      _.extend(item1, item2);
    } else {
      arr1.push(item2);
    }
  });
}

module.exports.mergePlugins = function (plugins) {
  if (_.isObject(plugins)) {
    plugins = _.map(plugins, function (value, key) {
      return {
        name: key,
        value: key,
        checked: value
      };
    });
  }

  mergeCollections(module.exports.plugins.prompts[0].choices, plugins, 'value');
};
module.exports.mergeAuthProvider = function (authProviders) {
  if (_.isObject(authProviders)) {
    authProviders = _.map(authProviders, function (value, key) {
      return {
        name: key,
        value: key,
        checked: value
      };
    });
  }

  mergeCollections(module.exports.auth.prompts[0].choices, authProviders, 'value');
};

module.exports.mergeStarterTemplates = function (templates) {
  mergeCollections(module.exports.starters.templates, templates, 'name');
};
