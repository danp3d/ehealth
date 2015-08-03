(function() {
  var TrainingSvc,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TrainingSvc = (function() {
    function TrainingSvc(baseUrl, $http1, authTokenSvc1) {
      this.baseUrl = baseUrl;
      this.$http = $http1;
      this.authTokenSvc = authTokenSvc1;
      this.deleteTrain = bind(this.deleteTrain, this);
      this.editTrain = bind(this.editTrain, this);
      this.insertTrain = bind(this.insertTrain, this);
      this.getTrainingHistory = bind(this.getTrainingHistory, this);
    }

    TrainingSvc.prototype.getTrainingHistory = function() {
      return this.$http.get(this.baseUrl);
    };

    TrainingSvc.prototype.insertTrain = function(type, duration, intensity) {
      var train;
      train = {
        train_date: new Date(),
        "type": type,
        durationMinutes: duration,
        intensity: intensity
      };
      return this.$http.post(this.baseUrl, train);
    };

    TrainingSvc.prototype.editTrain = function(_id, type, duration, intensity, date) {
      var train;
      train = {
        "_id": _id,
        "type": type,
        durationMinutes: duration,
        "intensity": intensity
      };
      return this.$http.put(this.baseUrl, train);
    };

    TrainingSvc.prototype.deleteTrain = function(_id) {
      return this.$http["delete"](this.baseUrl, {
        "_id": _id
      });
    };

    return TrainingSvc;

  })();

  angular.module('ehealth').factory('trainingSvc', function($http, API_BASE_URL, authTokenSvc) {
    return new TrainingSvc(API_BASE_URL + "training/", $http, authTokenSvc);
  });

}).call(this);
