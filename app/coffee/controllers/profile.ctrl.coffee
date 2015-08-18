angular.module 'ehealth'
    
    # Register Controller
    .controller 'profileCtrl', ($scope, userSvc, alertSvc, modalSvc, utilsSvc) ->
        $scope.user = userSvc.getLoginData().user
        
        $scope.getAgeYears = ->
            utilsSvc.getAgeYears $scope.user.dob
            
        $scope.getAgeMonths = ->
            utilsSvc.getAgeMonths $scope.user.dob
            
        $scope.getAgeDays = ->
            utilsSvc.getAgeDays $scope.user.dob
            
        $scope.translateActivityFactor = (factor) ->
            utilsSvc.translateActivityFactor factor
            
        $scope.translateWorkoutIntensity = (intensity, type) ->
            utilsSvc.translateWorkoutIntensity intensity, type
            
        $scope.getObjectiveDescription = (objectiveType) ->
            if objectiveType == "gain"
                "Calorias para ganho"
            else
                "Calorias a reduzir"
            
        $scope.showActiviryFactorHelp = ->
            modalSvc.showModal null, {
                hideCloseButton: true
                actionButton: 'Ok',
                headerText: 'Nível de esforço diario',
                bodyText: 'Define a quantidade de esforço exercida nas atividades do dia-a-dia. Exemplo: um trabalhador de escritorio se enquadraria em nível Muito Leve, enquanto um trabalhador na area de construção ou atleta se enquadraria em Moderado. Atletas de alto nível em período de treinamentos intensos se enquadram em Muito Intenso.'}
            
        $scope.updateProfile = ->
            userSvc.updateUser($scope.user)
                .success ->
                    alertSvc.alert "success", "Successo.", "Seus dados foram salvos"
                    
                .error -> 
                    alertSvc.alert "error", "Erro no servidor", "Ocorreu um erro ao tentar salvar os dados. Tente novamente."