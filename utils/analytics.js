
module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt([{
      type: 'confirm',
      name: 'flurry',
      message: 'Would you like to use Flurry Analytics?',
      default: false
    }], function (props) {
      self.flurry = props.flurry;
      done();
    }.bind(self));
  },
  install: function(self) {
    if (self.flurry) {
      self.directory('../templates/plugins/com.plugins.flurryLib', 'local_plugins/com.plugins.flurryLib');
    }
  }
};
