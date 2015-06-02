
module.exports = {
	ask: function(self) {
		var done = this.async();
      	this.prompt([{
        	type: 'confirm',
        	name: 'compass',
        	message: 'Would you like to use Sass with Compass (requires Ruby)?',
        	default: true
      	}], function (props) {
        	self.compass = props.compass;
        	done();
      	}.bind(self));
	}
};