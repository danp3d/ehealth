(function() {
  angular.module('ehealth').controller('mainCtrl', function($scope, authTokenSvc, alertSvc, modalSvc, utilsSvc, trainingSvc, userSvc, $location) {
    var loginData, wrk;
    loginData = userSvc.getLoginData();
    if (!loginData) {
      $location.path("/login");
    }
    $scope.user = loginData.user;
    $scope.basalMetabolicRate = utilsSvc.calculateBasalMetabolicRate($scope.user.weight, $scope.user.height, $scope.user.dob, $scope.user.sex);
    $scope.metabolicRate = utilsSvc.calculateDailyMetabolicRate($scope.basalMetabolicRate, $scope.user.activityFactor);
    $scope.vo2L = utilsSvc.convertVO2MlToL($scope.user.vo2Max, $scope.user.weight);
    wrk = $scope.user.workout;
    $scope.cardioCals = utilsSvc.calculateCalories(wrk.cardio.intensity, wrk.cardio.duration, 'cardio');
    $scope.strengthCals = utilsSvc.calculateCalories(wrk.strength.intensity, wrk.strength.duration, 'strength');
    $scope.totalMetabolicRate = utilsSvc.calculateTotalMetabolicRate($scope.metabolicRate, $scope.cardioCals + $scope.strengthCals);
    $scope.totalWeeklyMetabolicRate = ($scope.metabolicRate * 7) + (($scope.cardioCals + $scope.strengthCals) * wrk.timesPerWeek);
    $scope.periodization = {};
    $scope.periodization.cardioPercent = 50;
    $scope.periodization.strengthPercent = 50;
    $scope.$watch("periodization.cardioPercent", function() {
      var strength;
      strength = 100 - $scope.periodization.cardioPercent;
      if (strength !== $scope.periodization.strengthPercent) {
        return $scope.periodization.strengthPercent = strength;
      }
    });
    return $scope.$watch("periodization.strengthPercent", function() {
      var cardio;
      cardio = 100 - $scope.periodization.strengthPercent;
      if (cardio !== $scope.periodization.cardioPercent) {
        return $scope.periodization.cardioPercent = cardio;
      }
    });
  });

}).call(this);
