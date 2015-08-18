(function() {
  var Train, TrainCtrl, User, ctrl, jwt, mongoose, utils,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  User = require('./../models/userMdl');

  Train = require('./../models/trainMdl');

  jwt = require('./../services/jwt');

  utils = require('./../utils/utils');

  mongoose = require('mongoose');

  TrainCtrl = (function() {
    function TrainCtrl() {
      this.editTrain = bind(this.editTrain, this);
      this.insertTrain = bind(this.insertTrain, this);
      this.getTraining = bind(this.getTraining, this);
    }

    TrainCtrl.prototype.getTraining = function(req, res) {
      var user_id;
      user_id = utils.getUserID(req, res);
      return Train.find({
        user_id: new mongoose.Types.ObjectId(user_id.toString())
      }).exec(function(err, training) {
        if (err) {
          res.status(500).send({
            message: 'Internal server error. ' + err
          });
        }
        if (!err && !training) {
          res.status(500).send({
            message: 'Impossivel encontrar treinos'
          });
        }
        if (training) {
          return res.status(200).send({
            training: training
          });
        }
      });
    };

    TrainCtrl.prototype.insertTrain = function(req, res) {
      var data, newTrn, ref, self, user_id;
      self = this;
      data = req.body;
      user_id = utils.getUserID(req, res);
      if (!data.train_date || !data.durationMinutes || !data.intensity || ((ref = data.type) !== 'cardio' && ref !== 'strength')) {
        return res.status(500).send(message('Invalid data!'));
      } else {
        newTrn = new Train({
          "user_id": user_id,
          date_created: new Date(),
          train_date: data.train_date,
          type: data.type,
          durationMinutes: data.durationMinutes,
          intensity: data.intensity
        });
        return newTrn.save(function(err) {
          if (err) {
            res.status(500);
            return res.send(err);
          } else {
            return res.status(200).send({
              training: newTrn
            });
          }
        });
      }
    };

    TrainCtrl.prototype.editTrain = function(req, res) {
      var data, ref, self, user_id;
      self = this;
      data = req.body;
      user_id = utils.getUserID(req, res);
      if (!data.train_id || !data.train_date || !data.durationMinutes || !data.intensity || ((ref = data.type) !== 'cardio' && ref !== 'strength')) {
        return res.status(500).send(message('Invalid data!'));
      } else {
        return Train.findOne({
          _id: data.train_id
        }).populate('user_id').exec(function(err, train) {
          if (err) {
            res.status(500).send({
              message: 'Internal server error'
            });
          }
          if (!train) {
            res.status(500).send({
              message: 'Couldn\'t find record'
            });
          }
          if (train.user_id !== user_id) {
            res.status(500).send({
              message: 'You can\'t edit other users\' records'
            });
          }
          train.train_date = data.train_date;
          train.durationMinutes = data.durationMinutes;
          train.type = data.type;
          return train.save(function(err) {
            if (err) {
              return res.status(500).send(err);
            } else {
              return res.status(200).send({
                training: train
              });
            }
          });
        });
      }
    };

    return TrainCtrl;

  })();

  ctrl = new TrainCtrl();

  module.exports = ctrl;

}).call(this);
