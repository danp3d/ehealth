angular.module 'ehealth'

    # Create the Validate Equals directive
    .directive 'validateEquals', ->
        # it requires ngModel
        require: 'ngModel'
        link: (scope, element, attrs, ngModelCtrl) ->
            # Validate Function, which checks if the value informed is the same as the validateEquals attribute
            validateEquals = (value) ->
                valid = value == (scope.$eval attrs.validateEquals)
                ngModelCtrl.$setValidity 'equal', valid
                
                return value if valid
                #ir not valid, return undefined
                undefined
            
            # Register the "validateEquals" function 
            ngModelCtrl.$parsers.push validateEquals
            ngModelCtrl.$formatters.push validateEquals
            
            # Register watcher
            scope.$watch attrs.validateEquals, ->
                ngModelCtrl.$setViewValue ngModelCtrl.$viewValue
            