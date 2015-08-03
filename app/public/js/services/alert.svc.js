(function() {
  angular.module('ehealth').factory('alertSvc', function($rootScope) {
    return {
      alert: (function(_this) {
        return function(type, title, message, timeout) {
          toastr.options.newestOnTop = false;
          toastr.options.timeout = timeout || 2000;
          return toastr[type](message, title);
        };
      })(this)
    };
  });

}).call(this);
