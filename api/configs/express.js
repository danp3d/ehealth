(function() {
  var bodyparser, express;

  express = require('express');

  bodyparser = require('body-parser');

  module.exports = function(app, opts) {
    app.use(bodyparser.json());
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return next();
    });
    return app.use(express["static"](__dirname + '/../../app/public'));
  };

}).call(this);
