angular.module 'ehealth'
    
    # Register Controller
    .controller 'trainingCtrl', ($scope, authTokenSvc, alertSvc, modalSvc, utilsSvc, trainingSvc) ->
        trainingSvc.getTrainingHistory()
            .success (result) ->
                $scope.training = result.training
            
            .error (err) ->
                $scope.training = undefined
                alertSvc.alert "error", "Bad, bad server!", "Erro ao tentar obter historico de treinamento. " + err.message
    
    
        $scope.usr = authTokenSvc.getUser()
        
        $scope.newTrain = 
            type: 'cardio'
            duration: $scope.usr.workout.cardio.duration
            intensity: $scope.usr.workout.cardio.intensity
        
        $scope.types = [
            id: 'cardio'
            title: 'Cardiovascular (aerobico)'
           ,
            id: 'strength'
            title: 'Forca (anaerobico)'
        ]
        
        $scope.$watch 'newTrain.type', (newValue, oldValue) ->
            if newValue != oldValue and newValue
                $scope.newTrain.intensity = $scope.usr.workout[newValue].intensity
                $scope.newTrain.duration = $scope.usr.workout[newValue].duration
        
        $scope.getDefaultIntensity = (type) ->
            return $scope.usr.workout[cardio].intensity
                
        
        $scope.translateActivityFactor = (factor) ->
            utilsSvc.translateActivityFactor factor
            
        $scope.translateWorkoutIntensity = (intensity, type) ->
            utilsSvc.translateWorkoutIntensity intensity, type
            
        $scope.translateWorkoutType = (type) ->
            utilsSvc.translateWorkoutType type
            
        $scope.calculateCalories = (duration, intensity, type) ->
            utilsSvc.calculateCaloriesForUsr $scope.usr, {durationMinutes: duration, intensity: intensity, type: type}
        
        $scope.translateIntensityToVO2Max = (intensity, type) ->
            parseFloat ((utilsSvc.translateIntensityToVO2Max intensity, type) * 100).toFixed 3
            
        $scope.calculateTotalCaloriesForToday = ->
            utilsSvc.calculateCaloriesForDay $scope.usr, $scope.training
            
        $scope.insertTrain = ->
            trainingSvc.insertTrain $scope.newTrain.type, $scope.newTrain.duration, $scope.newTrain.intensity
                .success (result) ->
                    $scope.training.push result.training
                    
                .error (err) ->
                    alertSvc.alert "error", "Bad, bad server!", "Erro ao tentar salvar novo treino. " + err