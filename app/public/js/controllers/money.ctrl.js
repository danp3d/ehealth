(function() {
  angular.module('ehealth').controller('healthCtrl', function($scope, $http, alertSvc, authTokenSvc, API_BASE_URL) {
    return $http.get(API_BASE_URL + 'transactions').success(function(data) {
      return $scope.transactions = data;
    }).error(function(err) {
      return alertSvc.alert("error", "Error", err.message || err);
    });
  });

}).call(this);
