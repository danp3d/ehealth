
/* Facebook API Settings */

(function() {
  var bootstrapFbAPI;

  bootstrapFbAPI = function() {
    var id, js, ref;
    js = null;
    id = 'facebook-jssdk';
    ref = document.getElementsByTagName('script')[0];
    if (!document.getElementById(id)) {
      js = document.createElement('script');
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      return ref.parentNode.insertBefore(js, ref);
    }
  };

  bootstrapFbAPI();


  /* Angular APP settings */

  angular.module('ehealth', ['ui.router', 'ui.bootstrap', 'ngAnimate']).constant('API_BASE_URL', 'http://192.168.0.17:3030/api/').config(function($stateProvider, $httpProvider, $windowProvider) {
    $stateProvider.state('register', {
      url: '/register',
      templateUrl: 'views/register.html',
      controller: 'loginCtrl'
    }).state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'loginCtrl'
    }).state('logout', {
      url: '/logout',
      controller: 'logoutCtrl'
    }).state('profile', {
      url: '/profile',
      templateUrl: 'views/profile.html',
      controller: 'profileCtrl'
    }).state('training', {
      url: '/training',
      templateUrl: 'views/training.html',
      controller: 'trainingCtrl'
    }).state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'mainCtrl'
    });
    $httpProvider.defaults.transformRequest.push(function(data, headersGetter) {
      $('#spinner').hide();
      return data;
    });
    $httpProvider.interceptors.push('authInterceptorSvc');
    return $httpProvider.interceptors.push('spinnerInterceptorSvc');
  }).run(function(facebookAuthSvc) {
    return facebookAuthSvc.configureFacebookAPI();
  });

}).call(this);
