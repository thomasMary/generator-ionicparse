angular.module('{{APP_NAME}}.services').factory('PushNotificationService', [
  '$http',
  '$q',
  '$ionicPlatform',
  '$rootScope',
  function ($http, $q, $ionicPlatform, $rootScope) {
    var pluginNativeName = 'ParsePushNotificationPlugin';
    
    var handlePush = function (state, json) {
      // state == 'background' || 'foreground'
      // do something with it. eg $rootScope.broadcast('push', json);
    };
    var getPlugin = function () {
      var q = $q.defer();
      $ionicPlatform.ready(function () {
        if (window.plugin && window.plugin.parse_push) {
          q.resolve(window.plugin.parse_push);
        } else {
          q.reject('Push notification plugin not found');
        }
      });
      return q.promise;
    };
    var register = function (currentUser) {
      var q = $q.defer();
      getPlugin().then(function (parsePlugin) {
        parsePlugin.getInstallationId(function (data) {
          $http({
            method: 'PUT',
            url: 'https://api.parse.com/1/installations/' + data.id,
            data: {
              badge: 0,
              user: {
                '__type': 'Pointer',
                'className': '_User',
                'objectId': currentUser.objectId
              }
            }
          }).success(function() {
            q.resolve();
          }).error(function(err) {
            q.reject(data);
          });
        }, function(err) {
          q.reject(data);
        });
      }, function(err) {
        q.reject(data);
      });
      return q.promise;
    };
    var init = function () {
      var q = $q.defer();
      getPlugin().then(function (parsePlugin) {
        parsePlugin.register([], function () {
          q.notify('register to push notifications');
        }, function(err) {
          q.reject(err);
        });
        parsePlugin.ontrigger = function (state, json) {
          handlePush(state, json);
        };
      }, function(err) {
        q.reject(err);
      });
      return q.promise;
    };
    var dataService = {
      /* PROPERTIES */
      /* METHOD */
      init: init,
      register: register
    };
    return dataService;
  }
]);