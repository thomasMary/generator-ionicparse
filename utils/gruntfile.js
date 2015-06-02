
var path      = require('path');
var async     = require('async');

var flurryIdPrompt = [
  {
    type: 'input',
    name: 'FLURRY_ID_DEV',
    message: 'Enter your Flurry_id for your development environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'FLURRY_ID_DEV'
  },
  {
    type: 'input',
    name: 'FLURRY_ID_PROD',
    message: 'Enter your Flurry_id for your production environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'FLURRY_ID_PROD'
  }
];
var parseIdPrompt = [
  {
    type: 'input',
    name: 'PARSE_APP_DEV_ID',
    message: 'Enter your PARSE_APP_ID for your development environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'PARSE_APP_DEV_ID'
  },
  {
    type: 'input',
    name: 'PARSE_CLIENT_DEV_ID',
    message: 'Enter your PARSE_CLIENT_ID for your development environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'PARSE_CLIENT_DEV_ID'
  },
  {
    type: 'input',
    name: 'PARSE_APP_PROD_ID',
    message: 'Enter your PARSE_APP_ID for your production environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'PARSE_APP_DEV_ID'
  },
  {
    type: 'input',
    name: 'PARSE_CLIENT_PROD_ID',
    message: 'Enter your PARSE_CLIENT_ID for your production environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'PARSE_CLIENT_PROD_ID'
  }
];
var facebookPrompt = [
  {
    type: 'input',
    name: 'FACEBOOK_APP_NAME_DEV',
    message: 'Enter your Facebook APP_NAME for your development environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'FACEBOOK_APP_NAME_DEV'
  },
  {
    type: 'input',
    name: 'FACEBOOK_APP_ID_DEV',
    message: 'Enter your Facebook APP_ID for your development environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'FACEBOOK_APP_ID_DEV'
  },
  {
    type: 'input',
    name: 'FACEBOOK_APP_NAME_PROD',
    message: 'Enter your Facebook APP_NAME for your production environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'FACEBOOK_APP_NAME_PROD'
  },
  {
    type: 'input',
    name: 'FACEBOOK_APP_ID_PROD',
    message: 'Enter your Facebook APP_ID for your production environment.\n (You can let it blank and fill it later in Gruntfile.js)',
    default: 'FACEBOOK_APP_ID_PROD'
  },
];

module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt([{
      type: 'confirm',
      name: 'grunt',
      message: 'Would you like to use grunt?',
      default: true
    }], function (props) {
        self.grunt = props.grunt;
        done();
    }.bind(self));
  },
  install: function(self) {
    if (self.grunt) {
      var done = self.async();
      var gruntfile = self.readFileAsString(path.join(__dirname, '../templates/common/_Gruntfile.js'))
      var removePlugins = '';
      var installPluginsDev = '';
      var installPluginsProd = '';

      async.waterfall([
        function askForFlurryIds(next) {
          if (self.flurry) {
            self.prompt(flurryIdPrompt, function (props) {
              installPluginsDev += "'installPluginsWithVariable::local_plugins/com.{{APP_NAME}}.flurryLib/:--variable FLURRY_ID=" + props.FLURRY_ID_DEV + "'\,\n";
              installPluginsProd += "'installPluginsWithVariable::local_plugins/com.{{APP_NAME}}.flurryLib/:--variable FLURRY_ID=" + props.FLURRY_ID_PROD + "'\,\n";
              removePlugins += "\'removePlugin:com.{{APP_NAME}}.flurryLib\',\n";
              next();
            }.bind(self));
          } else {
            next();
          }
        },
        function askForParseIds(next) {
          if (self.push) {
            self.prompt(parseIdPrompt, function (props) {
              installPluginsDev += "'installPluginsWithVariable::local_plugins/com.{{APP_NAME}}.parsePushNotifications/:--variable APP_ID=" + props.PARSE_APP_DEV_ID + " --variable CLIENT_ID=" + props.PARSE_CLIENT_DEV_ID + "\',\n";
              installPluginsProd += "'installPluginsWithVariable::local_plugins/com.{{APP_NAME}}.parsePushNotifications/:--variable APP_ID=" + props.PARSE_APP_PROD_ID + " --variable CLIENT_ID=" + props.PARSE_CLIENT_PROD_ID + "\',\n";
              removePlugins += "\'removePlugin:com.{{APP_NAME}}.parsePushNotifications\',\n";
              next();
            }.bind(self));
          } else {
            next();
          }
        },
        function askForFacebookIds(next) {
          if (self.facebook) {
            self.prompt(facebookPrompt, function (props) {
              installPluginsDev += "'installPluginsWithVariable:1:github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID=" + props.FACEBOOK_APP_ID_DEV + " --variable APP_NAME=" + props.FACEBOOK_APP_NAME_DEV + "'\n";
              installPluginsProd += "'installPluginsWithVariable:1:github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID=" + props.FACEBOOK_APP_ID_PROD + " --variable APP_NAME=" + props.FACEBOOK_APP_NAME_PROD + "'\n";
              removePlugins += "\'removePlugin:com.phonegap.plugins.facebookconnect\'\n"  
              next();
            }.bind(self));
          } else {
            next();
          }
        }
      ], function() {
        gruntfile = gruntfile.replace(new RegExp("{{PLUGINS_DEV}}", 'g'), installPluginsDev);
        gruntfile = gruntfile.replace(new RegExp("{{PLUGINS_PROD}}", 'g'), installPluginsProd);
        gruntfile = gruntfile.replace(new RegExp("{{REMOVE_PLUGINS}}", 'g'), removePlugins);
        gruntfile = gruntfile.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);
        self.write('Gruntfile.js', gruntfile);
        done();
      });
    }
  }
};
