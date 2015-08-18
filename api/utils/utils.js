(function() {
  var jwt, secret;

  jwt = require('./../services/jwt');

  secret = 's3cr3tm4t3';

  exports.getUserID = (function(_this) {
    return function(req, res) {
      var payload, token, user_id;
      if (!req.headers.authorization) {
        return res.status(401).send({
          message: 'User not logged in'
        });
      }
      token = req.headers.authorization.split(' ');
      payload = jwt.decode(token[1], secret);
      user_id = payload.sub;
      return user_id;
    };
  })(this);

}).call(this);
