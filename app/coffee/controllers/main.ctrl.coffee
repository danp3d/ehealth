angular.module 'ehealth'
    
    # Register Controller
    .controller 'mainCtrl', ($scope, authTokenSvc, alertSvc, modalSvc, utilsSvc, trainingSvc, userSvc, $location) ->
        loginData = userSvc.getLoginData()
        $location.path "/login" if (!loginData)
        
        $scope.user = loginData.user
        if not $scope.user.periodization
            $location.path "/profile"
        
        # Programmed
        $scope.basalMetabolicRate = 
            utilsSvc.calculateBasalMetabolicRate $scope.user.weight, $scope.user.height, $scope.user.dob, $scope.user.sex
        $scope.metabolicRate = utilsSvc.calculateDailyMetabolicRate $scope.basalMetabolicRate, $scope.user.activityFactor
        $scope.vo2L = utilsSvc.convertVO2MlToL $scope.user.vo2Max, $scope.user.weight
        $scope.objectiveCals = $scope.user.objectiveCalories
        if $scope.user.objective == 'loss'
            $scope.objectiveCals *= -1
        
        wrk = $scope.user.workout
        $scope.cardioCals = utilsSvc.calculateCalories $scope.vo2L, wrk.cardio.intensity, wrk.cardio.duration, 'cardio'
        $scope.strengthCals = utilsSvc.calculateCalories $scope.vo2L, wrk.strength.intensity, wrk.strength.duration, 'strength'
        $scope.totalTrainCals = parseFloat($scope.cardioCals) + parseFloat($scope.strengthCals)
        $scope.totalMetabolicRate = 
            utilsSvc.calculateTotalMetabolicRate($scope.metabolicRate, $scope.totalTrainCals).toFixed(2)
        
        $scope.totalWeeklyMetabolicRate = 
            ((parseFloat($scope.metabolicRate) * 7) + ($scope.totalTrainCals * wrk.timesPerWeek)).toFixed(2)
        
        # Intake
        $scope.ingestedCalsDay = 0
        $scope.ingestedCalsWeek = 0
        
        # Workouts (actual)
        trainingSvc.getTrainingHistory().then (res) ->
            history = res.data.training
            $scope.spentCalsDay = utilsSvc.calculateCaloriesForDay $scope.user, history
            $scope.spentCalsWeek = utilsSvc.calculateCaloriesForWeek $scope.user, history
            
            # Results
            $scope.resultsCalsDay = 
                parseFloat($scope.ingestedCalsDay) + parseFloat($scope.spentCalsDay) - parseFloat($scope.totalMetabolicRate)
            $scope.resultsCalsWeek = 
                parseFloat($scope.ingestedCalsWeek) + parseFloat($scope.spentCalsWeek) - parseFloat($scope.totalWeeklyMetabolicRate)
        
            
        
        $scope.periodization = {}
        $scope.periodization.cardioPercent = 50
        $scope.periodization.strengthPercent = 50
        
        $scope.$watch "periodization.cardioPercent", () ->
            $scope.periodization.cardioCalories = ($scope.totalTrainCals * ($scope.periodization.cardioPercent / 100)).toFixed 3
            $scope.periodization.cardioMinutes = (utilsSvc.calculateSessionDuration $scope.user.vo2Max, wrk.cardio.intensity, 'cardio', $scope.user.weight, parseFloat $scope.periodization.cardioCalories).toFixed 3
            strength = 100 - $scope.periodization.cardioPercent
            $scope.periodization.strengthPercent = strength if strength != $scope.periodization.strengthPercent
        
        $scope.$watch "periodization.strengthPercent", () ->
            $scope.periodization.strengthCalories = ($scope.totalTrainCals * ($scope.periodization.strengthPercent / 100)).toFixed 3
            $scope.periodization.strengthMinutes = (utilsSvc.calculateSessionDuration $scope.user.vo2Max, wrk.strength.intensity, 'strength', $scope.user.weight, parseFloat $scope.periodization.strengthCalories).toFixed 3
            cardio = 100 - $scope.periodization.strengthPercent
            $scope.periodization.cardioPercent = cardio if cardio != $scope.periodization.cardioPercent
        