(function() {
  angular.module('ehealth').factory('modalSvc', function($modal) {
    var modalDefaults, modalOptions;
    modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: 'views/modal.html'
    };
    modalOptions = {
      closeButtonText: 'Close',
      actionButtonText: 'Ok',
      headerText: 'Please confirm',
      bodyText: 'Would you like to proceed?',
      hideCloseButton: false
    };
    return {
      showModal: (function(_this) {
        return function(customDefauts, customOptions) {
          var customDefaults;
          if (!customDefaults) {
            customDefaults = {};
          }
          customDefaults.backdrop = 'static';
          return _this.showModal(customDefaults, customOptions);
        };
      })(this),
      showModal: (function(_this) {
        return function(customDefauts, customOptions) {
          var customDefaults, tmpDefaults, tmpOptions;
          if (!customDefaults) {
            customDefaults = {};
          }
          if (!customOptions) {
            customOptions = {};
          }
          tmpDefaults = {};
          tmpOptions = {};
          angular.extend(tmpDefaults, modalDefaults, customDefaults);
          angular.extend(tmpOptions, modalOptions, customOptions);
          if (!tmpDefaults.controller) {
            tmpDefaults.controller = function($scope, $modalInstance) {
              $scope.modalOptions = tmpOptions;
              $scope.modalOptions.ok = function(result) {
                return $modalInstance.close(result);
              };
              return $scope.modalOptions.close = function(result) {
                return $modalInstance.dismiss('cancel');
              };
            };
          }
          return $modal.open(tmpDefaults).result;
        };
      })(this)
    };
  });

}).call(this);
