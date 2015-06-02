
var path = require('path');

var twitterPrompt = [
  {
    type: 'input',
    name: 'TWITTER_CONSUMER',
    message: 'Enter your TWITTER_CONSUMER. \n(You can let it blank and fill it later in constants.js)',
    default: 'TWITTER_CONSUMER'
  },
  {
    type: 'input',
    name: 'TWITTER_SECRET',
    message: 'Enter your TWITTER_SECRET. \n(You can let it blank and fill it later in constants.js)',
    default: 'TWITTER_SECRET'
  }
];

module.exports = {
  ask: function(self) {
    // nothing to do here
  },
  install: function(self) {
    var file = self.readFileAsString(path.join(__dirname, '../templates/scripts/constants.js'))
	file = file.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);
	if (self.flurry) {
		file += ".constant('ANALYTICS', {\n"+
				"\tLOGIN: 'login',\n" +
				"\tSHARE: 'share',\n" +
				"\tERROR: 'error',\n" +
				"\tPUSH: 'push'\n" +
				"})"
	}
	if (self.twitter) {
		var done = self.async();
        self.prompt(twitterPrompt, function (props) {
	 		file += ".constant('KEYS', {\n" +
	  				"\tTWITTER_CONSUMER: '"+props.TWITTER_CONSUMER+"',\n" +
	  				"\tTWITTER_SECRET: '"+ props.TWITTER_SECRET + "'\n" +
					"})";
			var filePath = path.join(self.jsPath, 'constants.js');
			self.write(filePath, file);
			self.scriptsFile.push(filePath);
			done();
        }.bind(self));
 	} else {
		var filePath = path.join(self.jsPath, 'constants.js');
		self.write(filePath, file);
		self.scriptsFile.push(filePath); 		
 	}
  }
};
