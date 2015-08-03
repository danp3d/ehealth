angular.module 'ehealth'

    # Authorization Interceptor service
    .factory 'authInterceptorSvc', (authTokenSvc) ->
        svc = {}

        svc.request = (config) ->
            token = authTokenSvc.getToken()
            config.headers.Authorization = 'Bearer ' + token if token

            return config

        svc.response = (response) ->
            return response
            
        return svc