(function() {
  var UserSvc,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  UserSvc = (function() {
    function UserSvc(baseUrl, $http1, $window1, authTokenSvc1, alertSvc1, $state1) {
      this.baseUrl = baseUrl;
      this.$http = $http1;
      this.$window = $window1;
      this.authTokenSvc = authTokenSvc1;
      this.alertSvc = alertSvc1;
      this.$state = $state1;
      this.oauthLogin = bind(this.oauthLogin, this);
      this.getLoginData = bind(this.getLoginData, this);
      this.updateUser = bind(this.updateUser, this);
      this.login = bind(this.login, this);
      this.registerUsr = bind(this.registerUsr, this);
    }

    UserSvc.prototype.registerUsr = function(email, pass, name, dob) {
      var authSvc, promise, svc;
      svc = this;
      authSvc = this.authTokenSvc;
      promise = this.$http.post(this.baseUrl, {
        "email": email,
        "pass": pass,
        "name": name,
        "dob": dob
      });
      promise.then(function(response) {
        authSvc.setToken(response.data.token);
        return authSvc.setUser(response.data.user);
      });
      return promise;
    };

    UserSvc.prototype.login = function(email, pass) {
      var authSvc, promise, svc;
      svc = this;
      authSvc = this.authTokenSvc;
      promise = this.$http.post(this.baseUrl + 'login/', {
        "email": email,
        "pass": pass
      });
      promise.then(function(response) {
        authSvc.setToken(response.data.token);
        return authSvc.setUser(response.data.user);
      });
      return promise;
    };

    UserSvc.prototype.updateUser = function(user) {
      var authSvc, promise, svc;
      svc = this;
      authSvc = this.authTokenSvc;
      promise = this.$http.post(this.baseUrl + 'profile/', {
        "user": user
      });
      promise.then(function(response) {
        return authSvc.setUser(response.data.user);
      });
      return promise;
    };

    UserSvc.prototype.getLoginData = function() {
      if (this.authTokenSvc.isAuthenticated()) {
        return {
          token: this.authTokenSvc.getToken(),
          user: this.authTokenSvc.getUser()
        };
      }
    };

    UserSvc.prototype.oauthLogin = function(usrInfo) {
      var authSvc, promise, svc;
      svc = this;
      authSvc = this.authTokenSvc;
      promise = this.$http.post(this.baseUrl + 'oauthLogin/', usrInfo);
      promise.then(function(response) {
        authSvc.setToken(response.data.token);
        return authSvc.setUser(response.data.user);
      });
      return promise;
    };

    return UserSvc;

  })();

  angular.module('ehealth').factory('userSvc', function($http, $window, API_BASE_URL, authTokenSvc, alertSvc, $state) {
    return new UserSvc(API_BASE_URL + "users/", $http, $window, authTokenSvc, alertSvc, $state);
  });

}).call(this);
