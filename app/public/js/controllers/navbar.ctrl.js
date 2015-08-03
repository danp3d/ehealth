(function() {
  angular.module('ehealth').controller('navbarCtrl', function($scope, authTokenSvc) {
    return $scope.isAuthenticated = authTokenSvc.isAuthenticated;
  });

}).call(this);
