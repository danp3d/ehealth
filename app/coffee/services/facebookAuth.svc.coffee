class FacebookAuthSvc
    constructor: (@$window, @userSvc) ->

    # Facebook Login
    facebookLogin: (callback) =>
        if FB
            self = this
            FB.login (response) ->
                if response.status == 'connected'
                    console.log "Logging in: " + JSON.stringify response
                    self.getUserInfo (usrInfo) ->
                        callback true, self.userSvc.oauthLogin usrInfo
                else # User logged off from Facebook. Remove the token
                    callback false
            , scope: 'public_profile,email'
    
    # Facebook API method to retrieve other information
    getUserInfo: (callback) =>
        usrInfo = {}
        # Get email
        FB.api '/me', (response) ->
            usrInfo.provider = "facebook"
            usrInfo.email = response.email
            # Get access token
            FB.getLoginStatus (response) ->
                usrInfo.accessToken = response.authResponse.accessToken
                callback usrInfo
    
    # Config FB api
    configureFacebookAPI: () =>
        svc = this
        # Facebook init and login watcher
        @$window.fbAsyncInit = ->
            FB.init
                appId: '799316576771792'
                channelUrl: 'views/channel.html'
                status: true
                cookie: true
                xfbml: true

# Get app
angular.module 'ehealth'
    # Declare the factory
    .factory 'facebookAuthSvc', ($window, userSvc) ->
        # Create service
        return new FacebookAuthSvc $window, userSvc
    