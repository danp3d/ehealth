angular.module 'ehealth'
    
    # Register Controller
    .controller 'logoutCtrl', ($scope, authTokenSvc, $state) ->
        authTokenSvc.removeToken()
        $state.go 'login'