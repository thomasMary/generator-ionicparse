
var path = require('path');

var askForModelPrompt = [{
  type: 'confirm',
  name: 'models',
  message: 'Would you like to add some model now (_User, Product, ...) ?'
}];

var askModelPrompt = [{
  type:'input',
  name:'model',
  message:'Enter the model you want to add (_User, Product, ...) or \"done\" if you are'
}];

var showModelPrompt = function(self, done) {
  self.prompt(askModelPrompt, function(props) {
    if ( props.model == 'done') {
      done();
    } else {
      self.models.push(props.model);
      showModelPrompt(self, done);
    }
  }.bind(self));  
}

module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt(askForModelPrompt, function (props) {
      if (props.models == true) {
        self.models = [];        
        showModelPrompt(self, done);
      } else {
        done();
      }
    }.bind(self));
  },
  install: function(self) {
    var models = self.models;
    if (models) {
      var done = self.async();
      for (var i = models.length - 1; i >= 0; i--) {
        var m = models[i];
        var modelFile = self.readFileAsString(path.join(__dirname, '../templates/scripts/model.js'))
        modelFile = modelFile.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);
        modelFile = modelFile.replace(new RegExp("{{MODEL}}", 'g'), m);
        var filePath = path.join(self.modelsPath, m + '.js');
        self.write(filePath, modelFile);
        self.scriptsFile.push(filePath);
      };
      done();      
    }
  },


};
