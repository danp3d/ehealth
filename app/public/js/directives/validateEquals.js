(function() {
  angular.module('ehealth').directive('validateEquals', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        var validateEquals;
        validateEquals = function(value) {
          var valid;
          valid = value === (scope.$eval(attrs.validateEquals));
          ngModelCtrl.$setValidity('equal', valid);
          if (valid) {
            return value;
          }
          return void 0;
        };
        ngModelCtrl.$parsers.push(validateEquals);
        ngModelCtrl.$formatters.push(validateEquals);
        return scope.$watch(attrs.validateEquals, function() {
          return ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
        });
      }
    };
  });

}).call(this);
