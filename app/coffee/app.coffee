### Facebook API Settings ###
bootstrapFbAPI = ->
    js = null
    id = 'facebook-jssdk'
    ref = document.getElementsByTagName('script')[0]

    if not document.getElementById(id)
        js = document.createElement 'script' 
        js.id = id
        js.async = true
        js.src = "//connect.facebook.net/en_US/all.js"
        ref.parentNode.insertBefore js, ref
bootstrapFbAPI()

### Angular APP settings ###
angular.module('ehealth', ['ui.router', 'ui.bootstrap', 'ngAnimate'])
    # Constants
    .constant 'API_BASE_URL', 'http://192.168.0.17:3030/api/'

    # Configure the app
    .config ($stateProvider, $httpProvider, $windowProvider, $urlRouterProvider) ->
        # States (routes)
        $stateProvider
            .state 'register',
                url: '/register'
                templateUrl: 'views/register.html'
                controller: 'loginCtrl'

            .state 'login',
                url: '/login'
                templateUrl: 'views/login.html'
                controller: 'loginCtrl'

            .state 'logout',
                url: '/logout'
                controller: 'logoutCtrl'

            .state 'profile',
                url: '/profile'
                templateUrl: 'views/profile.html'
                controller: 'profileCtrl'
                
            .state 'training',
                url: '/training'
                templateUrl: 'views/training.html'
                controller: 'trainingCtrl'

            .state 'main',
                url: '/'
                templateUrl: 'views/main.html'
                controller: 'mainCtrl'
        
        $urlRouterProvider.when '', '/'
        $urlRouterProvider.otherwise '/'
                
        # Show the spinner once a http request starts
        $httpProvider.defaults.transformRequest.push (data, headersGetter) ->
            $('#spinner').hide()
            return data
        
        # Auth interceptor (include token in the http headers)        
        $httpProvider.interceptors.push 'authInterceptorSvc'
        $httpProvider.interceptors.push 'spinnerInterceptorSvc' # Hide the Spinner div when completing http requests


    # Things to do when the app start running
    .run (facebookAuthSvc) ->
        facebookAuthSvc.configureFacebookAPI()