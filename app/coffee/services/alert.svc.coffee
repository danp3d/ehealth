angular.module 'ehealth'
    
    # Alert service
    .factory 'alertSvc', ($rootScope) ->
        # Alert function
        alert: (type, title, message, timeout) =>
            toastr.options.newestOnTop = false
            toastr.options.timeout = timeout || 2000
            toastr[type](message, title)

            