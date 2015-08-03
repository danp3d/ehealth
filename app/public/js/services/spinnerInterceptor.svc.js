(function() {
  angular.module('ehealth').factory('spinnerInterceptorSvc', function($q, $window) {
    return function(promise) {
      return promise.then(function(response) {
        $("#spinner").hide();
        return response;
      }, function(response) {
        $("#spinner").hide();
        return $q.reject(response);
      });
    };
  });

}).call(this);
