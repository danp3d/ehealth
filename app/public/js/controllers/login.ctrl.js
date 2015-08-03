(function() {
  angular.module('ehealth').controller('loginCtrl', function($scope, userSvc, facebookAuthSvc, alertSvc, authTokenSvc, $state) {
    $scope.register = function() {
      return userSvc.registerUsr($scope.email, $scope.pass, $scope.name, $scope.dob).success(function(res) {
        alertSvc.alert("success", "Registered.", "You are now registered as " + res.user.email);
        return $state.go('main');
      }).error(function(err) {
        return alertSvc.alert("error", "Bad, bad server!", "Could not register user. " + err);
      });
    };
    $scope.login = function() {
      return userSvc.login($scope.email, $scope.pass).success(function(res) {
        alertSvc.alert("success", "Success.", "You are now logged in as " + res.user.email);
        return $state.go('main');
      }).error(function(err) {
        return alertSvc.alert("error", "Login Failed.", "Please check your credentials");
      });
    };
    return $scope.facebookLogin = function() {
      return facebookAuthSvc.facebookLogin(function(loggedIn, promise) {
        if (loggedIn) {
          promise.success(function(loginRes) {
            alertSvc.alert("success", "Logged in.", "You are now logged in as " + loginRes.user.email);
            return $state.go('main');
          });
          return promise.error(function(err) {
            return alertSvc.alert("error", "Bad, bad server!", "Could not process login. " + err.message);
          });
        } else {
          authTokenSvc.removeToken;
          return alertSvc.alert("warning", "Unable to login.");
        }
      });
    };
  });

}).call(this);
