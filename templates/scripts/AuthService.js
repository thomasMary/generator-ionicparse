'use strict';
angular.module('{{APP_NAME}}.services').factory('AuthService', [
  '$q',
  '$resource',
  'LocalStorageService',
  'LOCALSTORAGE',
  {{AUTH_PROVIDERS_QUOTED}}
  function ($q, $resource, LocalStorageService, LOCALSTORAGE {{AUTH_PROVIDERS}}) {
    var authenticateRequests = {
      'login': $resource('https://api.parse.com/1/login').get,
      'signup': $resource('https://api.parse.com/1/users').post,
      'validateSession': $resource('https://api.parse.com/1/users/me').get
    };
    var providers = {
    {{AUTH_SERVICE_PROVIDER}}
    }
    var authenticate = function(request, provider, userData) {
      var q = $q.defer();
      providers[provider].login(userData)
      .then(function(authData) {
        authenticateRequests[request](authData)
        .$promise.then(function(user) {
          dataService.currentUser = user;          
          q.resolve(user);
        }, function(data, status) {
          q.reject(data);
        });
      }, function(error) {
        q.reject(error);
      });
      return q.promise;
    }
    var autoLogin = function() {
      var q = $q.defer();
      var token = LocalStorageService.read(LOCALSTORAGE.TOKEN);
      dataService.currentUser = LocalStorageService.read(LOCALSTORAGE.CUSER);
      if (token && dataService.currentUser) {
        q.notify();
        authenticateRequests['validateSession']({
          headers:{'X-Parse-Session-Token':token}
        }).then(function(user) {
          dataService.currentUser = user;
          q.resolve(dataService.currentUser);
        }, function(err) {
          q.reject(err);
        });
      } else {
        q.reject('No session found');
      }
      return q;
    }
    
    var dataService = {
      /* PROPERTIES */
      currentUser: null,
      /* METHOD */
      authenticate: authenticate,
      autoLogin: autoLogin
    };
    return dataService;
  }
]);