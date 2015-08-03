(function() {
  angular.module('ehealth').controller('logoutCtrl', function($scope, authTokenSvc, $state) {
    authTokenSvc.removeToken();
    return $state.go('login');
  });

}).call(this);
