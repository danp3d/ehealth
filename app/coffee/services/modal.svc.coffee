angular.module 'ehealth'
    
    # Alert service
    .factory 'modalSvc', ($modal) ->
        modalDefaults = 
            backdrop: true
            keyboard: true
            modalFade: true
            templateUrl: 'views/modal.html'
        
        modalOptions =
            closeButtonText: 'Close'
            actionButtonText: 'Ok'
            headerText: 'Please confirm'
            bodyText: 'Would you like to proceed?'
            hideCloseButton: false
                
            
        # Show Modal function
        showModal: (customDefauts, customOptions) =>
            customDefaults = {} if not customDefaults
            customDefaults.backdrop = 'static'
            return @showModal customDefaults, customOptions
        
        showModal: (customDefauts, customOptions) =>
            customDefaults = {} if not customDefaults
            customOptions = {} if not customOptions
            
            tmpDefaults = {}
            tmpOptions = {}
            
            angular.extend tmpDefaults, modalDefaults, customDefaults
            angular.extend tmpOptions, modalOptions, customOptions
            
            if !tmpDefaults.controller
                tmpDefaults.controller = ($scope, $modalInstance) ->
                    $scope.modalOptions = tmpOptions
                    $scope.modalOptions.ok = (result) ->
                        $modalInstance.close result
                    $scope.modalOptions.close = (result) ->
                        $modalInstance.dismiss 'cancel'
                        
            return $modal.open(tmpDefaults).result

            