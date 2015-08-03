angular.module 'ehealth'

    # Authorization Token service
    .factory 'authTokenSvc', ($window) ->
        storage = $window.localStorage
        cachedToken = undefined
        cachedUsr = undefined
        userToken = 'ehUserToken'
        userObj = 'ehUserObj'
        

        # Service object
        svc = {}
        
        # Store and cache a token
        svc.setToken = (token) ->
            cachedToken = token
            storage.setItem(userToken, token)

        # Get cached or stored token
        svc.getToken = ->
            cachedToken = storage.getItem(userToken) if not cachedToken
            return cachedToken
            
        # Remove token (logoff)
        svc.removeToken = ->
            cachedToken = undefined
            storage.removeItem(userToken)

        # Do we have a token?
        svc.isAuthenticated = ->
            return !!svc.getToken()
            
        # Set user object
        svc.setUser = (usr) ->
            cachedUsr = usr
            storage.setItem(userObj, JSON.stringify usr)
        
        # Get user object
        svc.getUser = ->
            cachedUsr = JSON.parse storage.getItem(userObj) if not cachedUsr
            cachedUsr.dob = new Date(cachedUsr.dob)
            return cachedUsr

        return svc