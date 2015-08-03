(function() {
  angular.module('ehealth').factory('authTokenSvc', function($window) {
    var cachedToken, cachedUsr, storage, svc, userObj, userToken;
    storage = $window.localStorage;
    cachedToken = void 0;
    cachedUsr = void 0;
    userToken = 'ehUserToken';
    userObj = 'ehUserObj';
    svc = {};
    svc.setToken = function(token) {
      cachedToken = token;
      return storage.setItem(userToken, token);
    };
    svc.getToken = function() {
      if (!cachedToken) {
        cachedToken = storage.getItem(userToken);
      }
      return cachedToken;
    };
    svc.removeToken = function() {
      cachedToken = void 0;
      return storage.removeItem(userToken);
    };
    svc.isAuthenticated = function() {
      return !!svc.getToken();
    };
    svc.setUser = function(usr) {
      cachedUsr = usr;
      return storage.setItem(userObj, JSON.stringify(usr));
    };
    svc.getUser = function() {
      if (!cachedUsr) {
        cachedUsr = JSON.parse(storage.getItem(userObj));
      }
      cachedUsr.dob = new Date(cachedUsr.dob);
      return cachedUsr;
    };
    return svc;
  });

}).call(this);
