angular.module 'ehealth'

    # Authorization Interceptor service
    .factory 'spinnerInterceptorSvc', ($q, $window) ->
        (promise) ->
            promise.then (response) ->
                $("#spinner").hide()
                return response
            , (response) ->
                $("#spinner").hide()
                return $q.reject response