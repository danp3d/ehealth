(function() {
  angular.module('ehealth').controller('profileCtrl', function($scope, userSvc, alertSvc, modalSvc, utilsSvc) {
    $scope.user = userSvc.getLoginData().user;
    $scope.getAgeYears = function() {
      return utilsSvc.getAgeYears($scope.user.dob);
    };
    $scope.getAgeMonths = function() {
      return utilsSvc.getAgeMonths($scope.user.dob);
    };
    $scope.getAgeDays = function() {
      return utilsSvc.getAgeDays($scope.user.dob);
    };
    $scope.translateActivityFactor = function(factor) {
      return utilsSvc.translateActivityFactor(factor);
    };
    $scope.translateWorkoutIntensity = function(intensity, type) {
      return utilsSvc.translateWorkoutIntensity(intensity, type);
    };
    $scope.getObjectiveDescription = function(objectiveType) {
      if (objectiveType === "gain") {
        return "Calorias para ganho";
      } else {
        return "Calorias a reduzir";
      }
    };
    $scope.showActiviryFactorHelp = function() {
      return modalSvc.showModal(null, {
        hideCloseButton: true,
        actionButton: 'Ok',
        headerText: 'Nível de esforço diario',
        bodyText: 'Define a quantidade de esforço exercida nas atividades do dia-a-dia. Exemplo: um trabalhador de escritorio se enquadraria em nível Muito Leve, enquanto um trabalhador na area de construção ou atleta se enquadraria em Moderado. Atletas de alto nível em período de treinamentos intensos se enquadram em Muito Intenso.'
      });
    };
    return $scope.updateProfile = function() {
      return userSvc.updateUser($scope.user).success(function() {
        return alertSvc.alert("success", "Successo.", "Seus dados foram salvos");
      }).error(function() {
        return alertSvc.alert("error", "Erro no servidor", "Ocorreu um erro ao tentar salvar os dados. Tente novamente.");
      });
    };
  });

}).call(this);
