'use strict';
angular.module('{{APP_NAME}}.services').factory('TwitterAuthService', [
  '$q',
  '$cordovaSocialSharing',
  '$ionicPlatform',
  '$cordovaOauthUtility',
  'TwitterPluginService',
  'KEYS',
  function ($q, $cordovaSocialSharings, $ionicPlatform, TwitterPluginService, KEYS) {
    var login = function () {
      var q = $q.defer();
      TwitterPluginService.login()
      .then( function (result) {
        q.resolve({
          'twitter': {
            'id': '' + result.id,
            'screen_name': result.screen_name,
            'consumer_key': KEYS.TWITTER_CONSUMER,
            'consumer_secret': KEYS.TWITTER_SECRET,
            'auth_token': result.oauth_token,
            'auth_token_secret': result.oauth_token_secret
          }
        });
      }, function (error) {
        q.reject(error);
      });
      return q.promise;
    };
    var share = function (title, image, link) {
      var q = $q.defer();
      $ionicPlatform.ready(function () {
        $cordovaSocialSharings.shareViaTwitter(title, image, link)
        .then(function () {
          q.resolve();
        }, function (error) {
          q.reject(error);
        });
      });
      return q.promise;
    };
    var dataService = {
      /* PROPERTIES */
      /* METHOD */
      login: login,
      share: share
    };
    return dataService;
  }
]);