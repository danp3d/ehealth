(function() {
  angular.module('ehealth').controller('mainCtrl', function($scope, authTokenSvc, alertSvc, modalSvc, utilsSvc, trainingSvc, userSvc) {
    var nut;
    $scope.user = userSvc.getLoginData().user;
    $scope.basalMetabolicRate = utilsSvc.calculateBasalMetabolicRate($scope.user.weight, $scope.user.height, $scope.user.dob, $scope.user.sex);
    $scope.metabolicRate = utilsSvc.calculateDailyMetabolicRate($scope.basalMetabolicRate, $scope.user.activityFactor);
    $scope.leanMass = utilsSvc.calculateLeanMass($scope.user.weight, $scope.user.bodyFat);
    $scope.maxGainRate = utilsSvc.calculateMaxGainRate($scope.leanMass, true);
    nut = utilsSvc.calculateOptimalNutrientIngestionForMassGain($scope.leanMass, $scope.maxGainRate, $scope.user.activityFactor);
    $scope.calories = nut.calories;
    $scope.proteins = nut.proteins;
    $scope.fat = nut.fat;
    return $scope.carbs = nut.carbs;
  });

}).call(this);
