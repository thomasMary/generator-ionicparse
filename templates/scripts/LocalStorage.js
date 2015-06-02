'use strict';
angular.module('{{APP_NAME}}.services').factory('LocalStorageService', [
  '$localStorage',
  function ($localStorage) {
    var create = function (name, value) {
      $localStorage[name] = value;
    };
    var read = function (name) {
      return $localStorage[name];
    };
    var remove = function (name) {
      delete $localStorage[name];
    };
    return {
      create: createCookie,
      read: readCookie,
      remove: remove
    };
  }
]);