angular.module 'ehealth'
    
    # Register Controller
    .controller 'loginCtrl', ($scope, userSvc, facebookAuthSvc, alertSvc, authTokenSvc, $state) ->
        
        # Register new user
        $scope.register = ->
            userSvc.registerUsr($scope.email, $scope.pass, $scope.name, $scope.dob)
                .success (res) -> 
                    alertSvc.alert "success", "Registered.", "You are now registered as " + res.user.email
                    $state.go 'main'
                    
                .error (err) -> 
                    alertSvc.alert "error", "Bad, bad server!", "Could not register user. " + err
                
        # Login user
        $scope.login = ->
            userSvc.login($scope.email, $scope.pass)
                .success (res) ->
                    alertSvc.alert "success", "Success.", "You are now logged in as " + res.user.email
                    $state.go 'main'
                    
                .error (err) -> 
                    alertSvc.alert "error", "Login Failed.", "Please check your credentials"
                    
        # Facebook login
        $scope.facebookLogin = ->
            facebookAuthSvc.facebookLogin (loggedIn, promise) ->
                if loggedIn
                    promise.success (loginRes) ->
                        alertSvc.alert "success", "Logged in.", "You are now logged in as " + loginRes.user.email
                        $state.go 'main'

                    promise.error (err) -> 
                        alertSvc.alert "error", "Bad, bad server!", "Could not process login. " + err.message
                else
                    authTokenSvc.removeToken
                    alertSvc.alert "warning", "Unable to login."