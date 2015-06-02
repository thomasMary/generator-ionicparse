
var templates = [
  {
    name: 'Tabs',
    user: 'driftyco',
    repo: 'ionic-starter-tabs'
  },
  {
    name: 'Sidemenu',
    user: 'driftyco',
    repo: 'ionic-starter-sidemenu'
  },
  {
    name: 'Blank',
    user: 'driftyco',
    repo: 'ionic-starter-blank'
  }
];


var chalk = require('chalk');

module.exports = {  
  ask: function(self) {
    var done = this.async();
    self.prompt([{
      type: 'list',
      name: 'starter',
      message: 'Which starter template would you like to use?',
      choices: _.pluck(templates, 'name'),
    }], function (props) {
      self.starter = _.find(templates, { name: props.starter });
      done();
    }.bind(self));
  },
  install: function(self) {
    console.log(chalk.yellow('Installing starter template. Please wait'));
    var done = this.async();
    var callback = function (error, remote) {
      if (error) {
        done(error);
      }
      // Template remote initialization: Copy from remote root folder (.) to working directory (/app)
      remote.directory('.', 'app');
      self.starterCache = remote.cachePath;
      done();
    }.bind(self);

    if (self.starter && self.starter.path) {
      self.log(chalk.bgYellow(chalk.black('WARN')) +
        chalk.magenta(' Getting the template from a local path.  This should only be used for developing new templates.'));
      self.remoteDir(self.starter.path, callback);
    } else if (self.starter.url) {
      self.remote(self.starter.url, callback, true);
    } else {
      self.remote(self.starter.user, self.starter.repo, 'master', callback, true);
    }
  }
};
