'use strict';
angular.module('{{APP_NAME}}.services').factory('{{MODEL}}', [
  '$q',
  '$resource',
  function ($q, $resource) {
    var resource = $resource('https://parse.com/1/classes/{{MODEL}}/:objectId');
    /* Constructor */
    function {{MODEL}}(data) {
      // Feel free to update the contructor to keep only the data you really need in your app.
      // For convenience, here we copy the entire data object, but keep in mind that your services should stay as light as possible
      angular.extend(this, data);
    }
    /* STATIC FUNCTION */
    {{MODEL}}.post  = resource.post;
    {{MODEL}}.get   = resource.get; 
    {{MODEL}}.put   = resource.put;     // objbectId is required
    {{MODEL}}.del   = resource.delete;  // objbectId is required

    /* METHOD */
    // You can add here some specific method, just like that:
    // {{MODEL}}.prototype.foo = function() {
    //   return 'bar';  
    // }

    return {{MODEL}};
  }
]);
