'use strict';
angular.module('{{APP_NAME}}.services').factory('FacebookAuthService', [
  '$q',
  '$http',
  '$cordovaFacebook',
  '$ionicPlatform',
  function ($q, $http, $cordovaFacebook, $ionicPlatform) {
    var getPlugin = function() {
      var q = $q.defer();
      $ionicPlatform.ready(function () {
        q.resolve($cordovaFacebook);
      });
      return q.promise;
    }
    var login = function () {
      var q = $q.defer();
      getPlugin().then(function(facebookPlugin) {
        facebookPlugin.login([
          'public_profile'
        ]).then(function (response) {
          response = response.authResponse;
          var expirationDate = new Date(new Date().getTime() + parseInt(response.expiresIn));
          var authData = {
            'facebook': {
              'id': response.userID,
              'access_token': response.accessToken,
              'expiration_date': expirationDate
            }
          };
          q.resolve(authData);
        }, function (error) {
          q.reject(error);
        });
      });
      return q.promise;
    };
    var share = function (link, caption, title, picture, description) {
      var q = $q.defer();
      getPlugin().then(function(facebookPlugin) {
        facebookPlugin.showDialog({
            method: 'share',
            href: link,
            caption: caption,
            name: title,
            description: description,
            picture: picture
          }).then(function (result) {
            q.resolve(result);
          }, function (error) {
            q.reject(error);
          });
        }
      });
      return q.promise;
    };
    var dataService = {
      /* PROPERTIES */
      /* METHOD */
      login: login,
      share: share,
    };
    return dataService;
  }
]);