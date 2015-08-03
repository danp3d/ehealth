class TrainingSvc
    constructor: (@baseUrl, @$http, @authTokenSvc) ->
    
    getTrainingHistory: =>
        @$http.get @baseUrl
    
    # Post new workout
    insertTrain: (type, duration, intensity) =>
        train =
            train_date: new Date()
            "type": type
            durationMinutes: duration
            intensity: intensity
        
        # Post new user
        @$http.post @baseUrl, train
    
    # Edit existing workout
    editTrain: (_id, type, duration, intensity, date) =>
        train =
            "_id": _id
            "type": type
            durationMinutes: duration
            "intensity": intensity
        
        # PUT data
        @$http.put @baseUrl, train
        
    # Delete existing train
    deleteTrain: (_id) =>
        @$http.delete @baseUrl, { "_id": _id }
            
# Get app
angular.module 'ehealth'
    # Declare the factory
    .factory 'trainingSvc', ($http, API_BASE_URL, authTokenSvc) ->
        # Create service
        return new TrainingSvc API_BASE_URL + "training/", $http, authTokenSvc