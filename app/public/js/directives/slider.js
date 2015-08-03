(function() {
  angular.module('ehealth').directive('slider', function() {
    return {
      restrict: 'E',
      template: 'views/slider.html',
      scope: {
        value: 0,
        min: 0,
        max: 100
      },
      replace: true,
      link: function($scope, elem, attr, ctrl) {
        return console.debug($scope);
      }
    };
  });

}).call(this);
