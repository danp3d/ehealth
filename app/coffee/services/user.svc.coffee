class UserSvc
    constructor: (@baseUrl, @$http, @$window, @authTokenSvc, @alertSvc, @$state) ->
    
    # Post new user
    registerUsr: (email, pass, name, dob) =>
        svc = this
        authSvc = @authTokenSvc
        
        # Post new user
        promise = @$http.post @baseUrl, { "email": email, "pass": pass, "name": name, "dob": dob }
        promise.then (response) ->
            authSvc.setToken response.data.token
            authSvc.setUser response.data.user
            
        return promise
    
    # Login user
    login: (email, pass) =>
        svc = this
        authSvc = @authTokenSvc
        
        # Post login info
        promise = @$http.post @baseUrl + 'login/', { "email": email, "pass": pass }
        promise.then (response) ->
            authSvc.setToken response.data.token
            authSvc.setUser response.data.user
            
        return promise
        
    # Update user info
    updateUser: (user) =>
        svc = this
        authSvc = @authTokenSvc
        
        # Post new profile
        promise = @$http.post @baseUrl + 'profile/', { "user": user }
        promise.then (response) ->
            authSvc.setUser response.data.user
            
        return promise
            
        
    # Get LoggedIn User and Token
    getLoginData: =>
        return { token: @authTokenSvc.getToken(), user: @authTokenSvc.getUser() } if @authTokenSvc.isAuthenticated()
        
    # OAuth Login
    oauthLogin: (usrInfo) =>
        svc = this
        authSvc = @authTokenSvc
        
        # Post OAuth info
        promise = @$http.post @baseUrl + 'oauthLogin/', usrInfo
        promise.then (response) ->
            authSvc.setToken response.data.token
            authSvc.setUser response.data.user
        
        return promise
        
# Get app
angular.module 'ehealth'
    # Declare the factory
    .factory 'userSvc', ($http, $window, API_BASE_URL, authTokenSvc, alertSvc, $state) ->
        # Create service
        return new UserSvc API_BASE_URL + "users/", $http, $window, authTokenSvc, alertSvc, $state