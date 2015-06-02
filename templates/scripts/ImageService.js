'use strict';
angular.module('{{APP_NAME}}.services').factory('ImageService', [
  '$q',
  '$http',
  function ($q, $http) {
    return {
      uploadBase64: function(base64, filename) {
        var q = $q.defer();
        var data = image.substr(image.indexOf(',') + 1);
        var jsonData = {
          'base64': data,
          '_ContentType': 'image/jpeg'
        };
        $http({
          method: 'POST',
          url: 'https://api.parse.com/1/files/' + filename ? filename : 'image',
          headers: { 'Content-Type': 'text/plain' },
          data: JSON.stringify(jsonData)
        }).success(function (file) {
          q.resolve(file);
        }).error(function(error) {
          q.reject(error);
        });
        return q.promise;
      }
    };

  }
]);