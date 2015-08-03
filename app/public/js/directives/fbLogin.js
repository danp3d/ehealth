(function() {
  angular.module('ehealth').directive('fbLogin', function($rootScope) {
    return function(scope, iElement, iAttrs) {
      if (FB) {
        return FB.XFBML.parse(iElement[0]);
      }
    };
  });

}).call(this);
