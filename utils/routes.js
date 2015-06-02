
var path      = require('path');
var camelCase = require('camel-case')

var showRouteAbstractPrompt = function(self, routeObj, done) {
  self.prompt([{
    type:'confirm',
    name:'routeAbstract',
    message:'  Is ' + routeObj.state + ' state abstract ?',
    default: false
  }], function(response) {
    routeObj.abstract = response.routeAbstract;
    self.routes.push(routeObj);
    showRouteStatePrompt(self, done);
  });
}
var showRouteUrlPrompt = function(self, routeObj, done) {
  self.prompt([{
    type:'input',
    name:'routeUrl',
    message:'  Enter the route URL for ' + routeObj.state + ' or \"done\" if you are',
    default: routeObj.state
  }], function(response) {
      if ( response.routeState == 'done') {
        done();
    } else {
      routeObj.url = response.routeUrl;
      showRouteAbstractPrompt(self, routeObj, done);
    }
  });
}
var showRouteStatePrompt = function(self, done) {
  var routeObj = {};
  self.prompt([{
    type:'input',
    name:'routeState',
    message:' Enter the route state or \"done\" if you are'
  }], function(response) {
      if ( response.routeState == 'done') {
        done();
    } else {
      routeObj.state = response.routeState;
      showRouteUrlPrompt(self, routeObj, done);
    }
  });
}

var generateConfigRoute = function(self, route) {
  var ctrl = camelCase(route.state) + 'Ctrl';
  var view = camelCase(route.state);
  var configRoute = 
    ".state(\'"+ route.state +"\', {\n" +
    "\t\turl: \'" + route.url + "',\n" +
    "\t\ttemplateUrl: \'templates/" + view + ".html\',\n"+
    "\t\tcontroller: \'" + ctrl +".js\',\n" +
    "\t\tabstract: " + route.abstract + ",\n" +
    "\t})";
  var ctrlFile = self.readFileAsString(path.join(__dirname, '../templates/scripts/ctrl.js'))
  ctrlFile = ctrlFile.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);
  ctrlFile = ctrlFile.replace(new RegExp("{{CTRL_NAME}}", 'g'), ctrl);
  var ctrlFilePath = path.join(self.ctrlPath, ctrl+'.js');
  self.write(ctrlFilePath, ctrlFile);
  self.write(path.join(self.viewPath, view+'.html'), '');
  self.scriptsFile.push(ctrlFilePath);
  return configRoute;
}

module.exports = {
  ask: function(self) {
    var done = self.async();
    self.prompt([{
      type: 'confirm',
      name: 'routes',
      message: 'Would you like to configure your routes now ?'
    }], function (response) {
      if (response.routes == true) {
        self.routes = [];
        showRouteStatePrompt(self, done);
      } else {
        done();
      }
    }.bind(self));
  },
  install: function(self) {
    var routes = self.routes;
    if (routes) {
      var configRoutes = '';
      if (routes.length > 0) {
        configRoutes = '$stateProvider\n\t';
      }
      for (var i = routes.length - 1; i >= 0; i--) {
        console.log('Installing route:' + routes[i].state);
        configRoutes = configRoutes + generateConfigRoute(self, routes[i]);
      };
      var file = self.readFileAsString(path.join(__dirname, '../templates/scripts/config.js'))
      file = file.replace(new RegExp("{{APP_NAME}}", 'g'), self.appName);
      file = file.replace(new RegExp("{{ROUTES}}", 'g'), configRoutes);
      var filePath = path.join(self.jsPath, 'config.js');
      self.write(filePath, file);
      self.scriptsFile.push(filePath);
    }
  }
};
