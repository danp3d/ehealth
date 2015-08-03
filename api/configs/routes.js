(function() {
  var trainCtrl, transCtrl, usrCtrl;

  usrCtrl = require('./../controllers/userCtrl');

  transCtrl = require('./../controllers/transCtrl');

  trainCtrl = require('./../controllers/trainCtrl');

  module.exports = function(app, opt) {
    usrCtrl.secret = opt.secret;
    transCtrl.secret = opt.secret;
    app.post("/api/users", usrCtrl.createUser);
    app.post("/api/users/login", usrCtrl.loginUser);
    app.post("/api/users/oauthLogin", usrCtrl.oauthLogin);
    app.post("/api/users/profile", usrCtrl.updateUserProfile);
    app.get("/api/transactions", transCtrl.getTransactions);
    app.get("/api/training", trainCtrl.getTraining);
    app.post("/api/training", trainCtrl.insertTrain);
    return app.put("/api/training", trainCtrl.editTrain);
  };

}).call(this);
