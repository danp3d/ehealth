(function() {
  var FacebookAuthSvc,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FacebookAuthSvc = (function() {
    function FacebookAuthSvc($window1, userSvc1) {
      this.$window = $window1;
      this.userSvc = userSvc1;
      this.configureFacebookAPI = bind(this.configureFacebookAPI, this);
      this.getUserInfo = bind(this.getUserInfo, this);
      this.facebookLogin = bind(this.facebookLogin, this);
    }

    FacebookAuthSvc.prototype.facebookLogin = function(callback) {
      var self;
      if (FB) {
        self = this;
        return FB.login(function(response) {
          if (response.status === 'connected') {
            console.log("Logging in: " + JSON.stringify(response));
            return self.getUserInfo(function(usrInfo) {
              return callback(true, self.userSvc.oauthLogin(usrInfo));
            });
          } else {
            return callback(false);
          }
        }, {
          scope: 'public_profile,email'
        });
      }
    };

    FacebookAuthSvc.prototype.getUserInfo = function(callback) {
      var usrInfo;
      usrInfo = {};
      return FB.api('/me', function(response) {
        usrInfo.provider = "facebook";
        usrInfo.email = response.email;
        return FB.getLoginStatus(function(response) {
          usrInfo.accessToken = response.authResponse.accessToken;
          return callback(usrInfo);
        });
      });
    };

    FacebookAuthSvc.prototype.configureFacebookAPI = function() {
      var svc;
      svc = this;
      return this.$window.fbAsyncInit = function() {
        return FB.init({
          appId: '799316576771792',
          channelUrl: 'views/channel.html',
          status: true,
          cookie: true,
          xfbml: true
        });
      };
    };

    return FacebookAuthSvc;

  })();

  angular.module('ehealth').factory('facebookAuthSvc', function($window, userSvc) {
    return new FacebookAuthSvc($window, userSvc);
  });

}).call(this);
