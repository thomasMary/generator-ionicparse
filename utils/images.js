
module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt([{
      type: 'confirm',
      name: 'images',
      message: 'Would you like to use ImageService?',
      default: true
    }], function (props) {
        self.images = props.images;
        done();
      }.bind(self));
  },
  install: function(self) {
    if (self.images) {
      var file = self.readFileAsString(path.join(__dirname, '../templates/scripts/ImageService.js'))
      file = file.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);  
      var filePath = path.join(self.servicesPath, 'ImageService.js');
      self.write(filePath, file);
      self.scriptsFile.push(filePath);
    }
  }
};
