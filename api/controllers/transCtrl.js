(function() {
  var TransCtrl, TransSchedule, Transaction, User, ctrl, jwt,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  User = require('./../models/userMdl');

  Transaction = require('./../models/transMdl');

  TransSchedule = require('./../models/transScheduleMdl');

  jwt = require('./../services/jwt');

  TransCtrl = (function() {
    function TransCtrl() {
      this.getTransactions = bind(this.getTransactions, this);
    }

    TransCtrl.prototype.secret = 's3cr3tm4t3';

    TransCtrl.prototype.getTransactions = function(req, res) {
      var data, payload, token;
      if (!req.headers.authorization) {
        return res.status(401).send({
          message: 'User not logged in'
        });
      }
      token = req.headers.authorization.split(' ');
      payload = jwt.decode(token[1], this.secret);
      data = [0, 1, 2, 3, 4, 5];
      return res.status(200).send({
        "data": data
      });
    };

    return TransCtrl;

  })();

  ctrl = new TransCtrl();

  module.exports = ctrl;

}).call(this);
