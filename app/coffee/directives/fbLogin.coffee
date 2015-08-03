angular.module 'ehealth'

    # Create the fb-login
    .directive 'fbLogin', ($rootScope) ->
        # Return function
        (scope, iElement, iAttrs) ->
            FB.XFBML.parse iElement[0] if FB