'use strict';
angular.module('{{APP_NAME}}.services').factory('UsernameAuthService', [
  '$q',
  function ($q) {
    var login = function (userData) {
      var q = $q.defer();
      q.resolve(userData);
      return q.promise;
    };
    var dataService = {
      /* PROPERTIES */
      /* METHOD */
      login: login
    };
    return dataService;
  }
]);