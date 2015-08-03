angular.module 'ehealth'
    
    # Register Controller
    .controller 'mainCtrl', ($scope, authTokenSvc, alertSvc, modalSvc, utilsSvc, trainingSvc, userSvc) ->
        $scope.user = userSvc.getLoginData().user
        $scope.basalMetabolicRate = 
            utilsSvc.calculateBasalMetabolicRate $scope.user.weight, $scope.user.height, $scope.user.dob, $scope.user.sex
        $scope.metabolicRate = utilsSvc.calculateDailyMetabolicRate $scope.basalMetabolicRate, $scope.user.activityFactor
        $scope.leanMass = utilsSvc.calculateLeanMass $scope.user.weight, $scope.user.bodyFat
        $scope.maxGainRate = utilsSvc.calculateMaxGainRate $scope.leanMass, true # get this value
        nut = utilsSvc.calculateOptimalNutrientIngestionForMassGain $scope.leanMass, $scope.maxGainRate, $scope.user.activityFactor
        $scope.calories = nut.calories
        $scope.proteins = nut.proteins
        $scope.fat = nut.fat
        $scope.carbs = nut.carbs