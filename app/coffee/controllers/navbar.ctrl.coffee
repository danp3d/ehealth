angular.module 'ehealth'
    
    # Register Controller
    .controller 'navbarCtrl', ($scope, authTokenSvc) ->
        $scope.isAuthenticated = authTokenSvc.isAuthenticated