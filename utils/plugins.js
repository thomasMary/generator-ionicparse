
var chalk = require('chalk');

var prompt = [{
  type: 'checkbox',
  name: 'plugins',
  message: 'Which Cordova plugins would you like to include?',
  choices: [{
    value: 'org.apache.cordova.console',
    name: 'org.apache.cordova.console',
    checked: true
  }, {
    value: 'com.ionic.keyboard',
    name: 'com.ionic.keyboard',
    checked: true
  }, {
    value: 'org.apache.cordova.splashscreen',
    name: 'org.apache.cordova.splashscreen',
    checked: true
  }, {
    value: 'org.apache.cordova.device',
    name: 'org.apache.cordova.device',
    checked: true
  }, {
    value: 'org.apache.cordova.statusbar',
    name: 'org.apache.cordova.statusbar',
    checked: false
  }, {
    value: 'org.apache.cordova.battery-status',
    name: 'org.apache.cordova.battery-status',
    checked: false
  }, {
    value: 'org.apache.cordova.network-information',
    name: 'org.apache.cordova.network-information',
    checked: false
  }, {
    value: 'org.apache.cordova.device-motion',
    name: 'org.apache.cordova.device-motion',
    checked: false
  }, {
    value: 'org.apache.cordova.device-orientation',
    name: 'org.apache.cordova.device-orientation',
    checked: false
  }, {
    value: 'org.apache.cordova.geolocation',
    name: 'org.apache.cordova.geolocation',
    checked: false
  }, {
    value: 'org.apache.cordova.camera',
    name: 'org.apache.cordova.camera',
    checked: false
  }, {
    value: 'org.apache.cordova.media-capture',
    name: 'org.apache.cordova.media-capture',
    checked: false
  }, {
    value: 'org.apache.cordova.media',
    name: 'org.apache.cordova.media',
    checked: false
  }, {
    value: 'org.apache.cordova.file',
    name: 'org.apache.cordova.file',
    checked: false
  }, {
    value: 'org.apache.cordova.file-transfer',
    name: 'org.apache.cordova.file-transfer',
    checked: false
  }, {
    value: 'org.apache.cordova.dialogs',
    name: 'org.apache.cordova.dialogs',
    checked: false
  }, {
    value: 'org.apache.cordova.vibration',
    name: 'org.apache.cordova.vibration',
    checked: false
  }, {
    value: 'org.apache.cordova.contacts',
    name: 'org.apache.cordova.contacts',
    checked: false
  }, {
    value: 'org.apache.cordova.inappbrowser',
    name: 'org.apache.cordova.inappbrowser',
    checked: false
  }]
}];
module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt(prompt, function (props) {
      self.plugins = props.plugins;
      done();
    }.bind(self));
  },
  install: function(self) {
    console.log(chalk.yellow('\nInstall plugins registered at plugins.cordova.io: ') + chalk.green('grunt plugin:add:org.apache.cordova.globalization'));
      console.log(chalk.yellow('Or install plugins direct from source: ') + chalk.green('grunt plugin:add:https://github.com/apache/cordova-plugin-console.git\n'));
      if (self.plugins.length > 0) {
        console.log(chalk.yellow('Installing selected Cordova plugins, please wait.'));
        
        // Turns out plugin() doesn't accept a callback so we try/catch instead
        try {
          cordova.plugin('add', self.plugins);
        } catch (e) {
          console.log(e);
          self.log.error(chalk.red('Please run `yo ionic` in an empty directory, or in that of an already existing cordova project.'));
          process.exit(1);
        }
      }
      if (self.lplugins.length > 0) {
        for (var i = self.lplugins.length - 1; i >= 0; i--) {
          var plugin = self.lplugins[i];
          // do something with it
        };
      }
  }
};
