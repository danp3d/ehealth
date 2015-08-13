(function() {
  angular.module('ehealth').controller('trainingCtrl', function($scope, authTokenSvc, alertSvc, modalSvc, utilsSvc, trainingSvc) {
    trainingSvc.getTrainingHistory().success(function(result) {
      return $scope.training = result.training;
    }).error(function(err) {
      $scope.training = void 0;
      return alertSvc.alert("error", "Bad, bad server!", "Erro ao tentar obter historico de treinamento. " + err.message);
    });
    $scope.usr = authTokenSvc.getUser();
    $scope.newTrain = {
      type: 'cardio',
      duration: $scope.usr.workout.cardio.duration,
      intensity: $scope.usr.workout.cardio.intensity
    };
    $scope.types = [
      {
        id: 'cardio',
        title: 'Cardiovascular (aerobico)'
      }, {
        id: 'strength',
        title: 'Forca (anaerobico)'
      }
    ];
    $scope.$watch('newTrain.type', function(newValue, oldValue) {
      if (newValue !== oldValue && newValue) {
        $scope.newTrain.intensity = $scope.usr.workout[newValue].intensity;
        return $scope.newTrain.duration = $scope.usr.workout[newValue].duration;
      }
    });
    $scope.getDefaultIntensity = function(type) {
      return $scope.usr.workout[cardio].intensity;
    };
    $scope.translateActivityFactor = function(factor) {
      return utilsSvc.translateActivityFactor(factor);
    };
    $scope.translateWorkoutIntensity = function(intensity, type) {
      return utilsSvc.translateWorkoutIntensity(intensity, type);
    };
    $scope.translateWorkoutType = function(type) {
      return utilsSvc.translateWorkoutType(type);
    };
    $scope.calculateCalories = function(duration, intensity, type) {
      return utilsSvc.calculateCaloriesForUsr($scope.usr, {
        durationMinutes: duration,
        intensity: intensity,
        type: type
      });
    };
    $scope.translateIntensityToVO2Max = function(intensity, type) {
      return parseFloat(((utilsSvc.translateIntensityToVO2Max(intensity, type)) * 100).toFixed(3));
    };
    $scope.calculateTotalCaloriesForToday = function() {
      return utilsSvc.calculateCaloriesForDay($scope.usr, $scope.training);
    };
    return $scope.insertTrain = function() {
      return trainingSvc.insertTrain($scope.newTrain.type, $scope.newTrain.duration, $scope.newTrain.intensity).success(function(result) {
        return $scope.training.push(result.training);
      }).error(function(err) {
        return alertSvc.alert("error", "Bad, bad server!", "Erro ao tentar salvar novo treino. " + err);
      });
    };
  });

}).call(this);
