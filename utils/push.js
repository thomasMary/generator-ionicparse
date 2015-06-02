
var path      = require('path');

module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt([{
      type: 'confirm',
      name: 'push',
      message: 'Would you like to use Parse push notification?',
      default: true
    }], function (props) {
        self.push = props.push;
        done();
      }.bind(self));
  },
  install: function(self) {
    if (self.push) {
      self.directory('../templates/plugins/com.plugins.parsePushNotifications', 'local_plugins/com.plugins.parsePushNotifications');
      //self.lplugins.push('local_plugins/com.plugins.parsePushNotifications --variable APP_ID=' + app_id + ' --variable CLIENT_ID=' + client_id);
      var file = self.readFileAsString(path.join(__dirname, '../templates/scripts/PushNotificationService.js'))
      file = file.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);  
      var filePath = path.join(self.servicesPath, 'PushNotificationService.js');
      self.write(filePath, file);
      self.scriptsFile.push(filePath);
    }
  }
};
