(function() {
  angular.module('ehealth').factory('authInterceptorSvc', function(authTokenSvc) {
    var svc;
    svc = {};
    svc.request = function(config) {
      var token;
      token = authTokenSvc.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    };
    svc.response = function(response) {
      return response;
    };
    return svc;
  });

}).call(this);
