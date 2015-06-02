'use strict';

var fs = require('fs');
var path = require('path');
var generators = require('yeoman-generator');
var _ = require('lodash');
var mout = require('mout');
var cordova = require('cordova');
var chalk = require('chalk');
var ionicUtils = require('../utils');
var mkdir = require('mkdirp');

var appPath = path.join(process.cwd(), 'app');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    console.log(ionicUtils.greeting);

    this.argument('appName', { type: String, required: false });
    this.option('appName', { type: String, required: false });
    this.option('appId', { type: String, required: false });
    this.options.selected = {};
    this.lplugins = [];
    this.scriptsFile = [];
  },

  prompting: {
    askForCompass: function() { ionicUtils.compass.ask(this); },
    askForRoutes: function() { ionicUtils.routes.ask(this); },
    askForModels: function() { ionicUtils.models.ask(this); },
    askForAuthProvider: function() { ionicUtils.auth.ask(this); },
    askForAnalytics: function() { ionicUtils.analytics.ask(this); },
    askForPush: function() { ionicUtils.push.ask(this); },
    askForPlugins: function() { ionicUtils.plugins.ask(this); },
    askForImageService: function() { ionicUtils.images.ask(this); },
    askForGrunt: function() { ionicUtils.grunt.ask(this); },
    askForStarter: function() { ionicUtils.grunt.ask(this); }
  },

  configuring: {
    commonVariables: function() {
      this.appName = this.appName || this.options.appName || path.basename(process.cwd());
      this.appName = mout.string.pascalCase(this.appName);
      this.appId = this.options.appId || 'com.example.' + this.appName;
      this.appPath = 'app';
      this.jsPath = this.appPath+'/js';
      this.ctrlPath = this.jsPath + '/controllers/';
      this.servicesPath = this.jsPath + '/services/';
      this.modelsPath = this.servicesPath + 'models/';
      this.directivesPath = this.jsPath + '/directives/';
      this.viewPath = 'templates/';
      this.root = process.cwd() + '/' + this.appName;

      this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    },

    setupEnv: function setupEnv() {
        // Removes thumbnail cache files
        var invisibleFiles = ['Thumbs.db', '.DS_Store'];
        invisibleFiles.forEach(function(filename) {
            var file = path.join(process.cwd(), filename)
            if(fs.existsSync(file) ) {
                fs.unlinkSync(file);
            }
       });
      
      // Copies the contents of the generator example app
      // directory into your users new application path
      this.sourceRoot(path.join(__dirname, '../templates/'));
      this.directory('common/root', '.', true);
      // create module.js
      var moduleFile = this.readFileAsString(path.join(__dirname, '../templates/scripts/module.js'))
      moduleFile = moduleFile.replace(new RegExp("{{APP_NAME}}", 'g'), this.appName);
      var moduleFilePath = this.jsPath + '/modules.js'
      this.write(moduleFilePath, moduleFile);
      this.scriptsFile.push(moduleFilePath);
    },

    packageFiles: function packageFiles() {
      this.template('common/_bower.json', 'bower.json');
      this.template('common/_bowerrc', '.bowerrc');
      this.template('common/_package.json', 'package.json');
      if (this.grunt)
        this.copy('common/_Gruntfile.js', 'Gruntfile.js');
      this.template('common/_gitignore', '.gitignore');
    }
  },

  writing: {
    cordovaInit: function cordovaInit() {
      var done = this.async();
      cordova.create('.', this.appId, this.appName, function (error) {
        if (error) {
          console.log(chalk.yellow(error.message + ': Skipping `cordova create`'));
        } else {
          console.log(chalk.yellow('Created a new Cordova project with name "' + this.appName + '" and id "' + this.appId + '"'));
          mkdir.sync('local_plugins');
        }
        done();
      }.bind(this));
    },
    installModels: function installModels() { ionicUtils.models.install(this); },
    installRoutes: function installRoutes() { ionicUtils.routes.install(this); },
    installAuthProvider: function installAuthProvider() { ionicUtils.auth.install(this); },
    installPush: function installPush() { ionicUtils.push.install(this); },
    installFlurry: function installFlurry() { ionicUtils.analytics.install(this); },
    installPlugins: function installPlugins()  { ionicUtils.plugins.install(this); },
    installImageService: function installImageService()  { ionicUtils.images.install(this); },
    installGrunt: function installAuthProvider() { ionicUtils.grunt.install(this); },
    installConstants: function installConstants() { ionicUtils.constants.install(this); }, 
    installStarter: function installStarter() { ionicUtils.starter.install(this); },

    readIndex: function readIndex() {
      this.indexFile = this.engine(this.read(path.join(this.starterCache, 'index.html')), this);
    },

    appJs: function appJs() {
      var scriptPrefix = 'js' + path.sep;
      var scripts = [scriptPrefix + 'configuration.js'];
      this.fs.store.each(function (file, index) {
        if (file.path.indexOf('.js') !== -1) {
          var relPath = path.relative(appPath, file.path);
          if (relPath.indexOf(scriptPrefix) === 0) {
            scripts.push(relPath);
          }
        }
      });
    },

    createIndexHtml: function createIndexHtml() {             
        // Regex: Vendor CSS
        this.indexFile = this.indexFile.replace(/<link href="lib\/ionic\/css\/ionic.css" rel="stylesheet">/g, "<!-- build:css styles\/vendor.css -->\n    <!-- bower:css -->\n    <!-- endbower -->\n    <!-- endbuild -->");
        
        // Regex: User CSS
        //this.indexFile = this.indexFile.replace(/<link href="css\/style.css" rel="stylesheet">/g, "<!-- build:css styles\/vendor.css -->\n    <!-- bower:css -->\n    <!-- endbower -->\n    <!-- endbuild -->");
        
        // Regex: Vendor scripts (vendor.js)
        this.indexFile = this.indexFile.replace(/<script src="lib\/ionic\/js\/ionic.bundle.js"><\/script>/g, "<!-- build:js scripts\/vendor.js -->\n    <!-- bower:js -->\n    <!-- endbower -->\n    <!-- endbuild -->");
      
       // Regex: User scripts (scripts.js)
       var scripts = '';
       for (var i = this.scriptsFile.length - 1; i >= 0; i--) {
         scripts += "\t<script src=\"" + this.scriptsFile[i] + "\"><\/script>\n";
       };
       this.indexFile = this.indexFile.replace(/<!-- your app's js -->/g,"<!-- your app's js -->\n    <!-- build:js scripts\/scripts.js -->");
       this.indexFile = this.indexFile.replace(/<\/head>/g, scripts + "    <!-- endbuild -->\n  <\/head>");
       
       // Regex/Rename: CSS path (Ionics 'css' to 'styles')
       this.indexFile = this.indexFile.replace(/href="css/g,"href=\"styles");
       
       // Regex/Rename: Scripts path (Ionics 'js' to 'scripts')
       this.indexFile = this.indexFile.replace(new RegExp("src=\"js", 'g'), "src=\"scripts");
       this.indexFile = this.indexFile.replace(new RegExp("src=\"app/js", 'g'), "src=\"scripts");

       // Write index.html
       this.indexFile = this.indexFile.replace(/&apos;/g, "'");
       this.write(path.join(this.appPath, 'index.html'), this.indexFile);
    },

    ensureStyles: function ensureStyles() {
      // Only create a main style file if the starter template didn't
      // have any styles. In the case it does, the starter should
      // supply both main.css and main.scss files, one of which
      // will be deleted
      
      var cssFile = 'main.' + (this.compass ? 'scss' : 'css');
      var unusedFile = 'main.' + (this.compass ? 'css' : 'scss');
      var stylePath = path.join(process.cwd(), 'app', 'css');
      var found = false;

      this.fs.store.each(function (file, index) {
        if (path.dirname(file.path) === stylePath) {
          var name = path.basename(file.path);

          if (name === cssFile) {
            found = true;
          } else if (name === unusedFile) {
            // BUG: The log will still report the the file was created
            this.fs.delete(file.path);
          }
        }
      }.bind(this));

      if (!found) {
        this.copy('styles/' + cssFile, 'app/css/' + cssFile);
      }

    },

    cordovaHooks: function cordovaHooks() {
      // copy hooks directory
      this.directory('hooks', 'hooks', true);
    },

    packages: function () {
      this.installDependencies({ skipInstall: this.options['skip-install'] });
    }
  },

  end: {
    hookPerms: function hookPerms() {
      var iconsAndSplash = 'hooks/after_prepare/icons_and_splashscreens.js';
      fs.chmodSync(iconsAndSplash, '755');
    },
    folderNames: function folderNames() {
      // Rename: Scripts path (Ionics 'js' to 'scripts')
      fs.rename(path.join(appPath, 'css'), path.join(appPath, 'styles'), function(err) {
          if ( err ) console.log('ERROR: ' + err);
      });
      // Rename: CSS path (Ionics 'css' to 'styles')
      fs.rename(path.join(appPath, 'js'), path.join(appPath, 'scripts'), function(err) {
          if ( err ) console.log('ERROR: ' + err);
      });     
      // Rename: Images path (Ionics 'img' to 'images')
      fs.rename(path.join(appPath, 'img'), path.join(appPath, 'images'), function(err) {
          if ( err ) console.log('ERROR: ' + err);
      });
    }
  }
});

