angular.module 'ehealth'
    
    # Register Controller
    .controller 'healthCtrl', ($scope, $http, alertSvc, authTokenSvc, API_BASE_URL) ->
        $http.get API_BASE_URL + 'transactions'
            .success (data) ->
                $scope.transactions = data
                
            .error (err) ->
                alertSvc.alert "error", "Error", err.message || err