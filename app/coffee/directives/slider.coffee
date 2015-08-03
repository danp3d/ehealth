angular.module 'ehealth'

    # Create the slider directive
    .directive 'slider', () ->
        restrict: 'E'
        template: 'views/slider.html'
        scope: 
            value: 0
            min: 0
            max: 100
        replace: true
        link: ($scope, elem, attr, ctrl) ->
            console.debug $scope