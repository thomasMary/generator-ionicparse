
var path = require('path');

var createService = function(self, provider) {
  if (provider == 'facebook')
    self.facebook = true;
  if (provider == 'twitter')
    self.twitter = true;
  var file = self.readFileAsString(path.join(__dirname, '../templates/scripts/' + provider + 'AuthService.js'))
  file = file.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);  
  var fileName = provider+'Service.js';
  var filePath = path.join(self.servicesPath, fileName);
  self.write(filePath, file);
  self.scriptsFile.push(filePath);
  return {'name': provider, 'service': provider+'Service'};
}

var prompt = [{
    type: 'checkbox',
    name: 'providers',
    message: 'Which Authentification provider would you like to include?',
    choices: [{
      value: 'twitter',
      name: 'Twitter',
      checked: false
    },
    {
      value: 'facebook',      
      name: 'Facebook',
      checked: false
    },
    {
      value: 'username',
      name: 'Username/Password',
      checked: false
    }
  ]
}];

module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt(prompt, function (props) {
      self.auth = props.providers;
      done();
    }.bind(self));
  },
  install: function(self) {
    console.log('install auth');
    var choices = self.auth;
    if (choices) {
      var serviceDependencies = '';
      var qServiceDependencies = '';
      var providers = '';
      for (var i = choices.length - 1; i >= 0; i--) {
        var service = createService(self, choices[i]);
        serviceDependencies += ', ' + service.service;
        qServiceDependencies += '\'' + service.service + '\',\n\t';
        providers += '\t' + service.name + ': ' + service.service + ((i == 0) ? '\n' : ',\n');
      };
      console.log(providers);
      var file = self.readFileAsString(path.join(__dirname, '../templates/scripts/AuthService.js'))
      file = file.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);  
      file = file.replace(new RegExp("{{AUTH_PROVIDERS_QUOTED}}", 'g'), qServiceDependencies);  
      file = file.replace(new RegExp("{{AUTH_PROVIDERS}}", 'g'), serviceDependencies); 
      file = file.replace(new RegExp("{{AUTH_SERVICE_PROVIDER}}", 'g'), providers); 

      var filePath = path.join(self.servicesPath, 'AuthService.js');
      self.write(filePath, file);
      self.scriptsFile.push(filePath);
    }
  }
};
