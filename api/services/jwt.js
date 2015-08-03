(function() {
  var base64Decode, base64Encode, crypto, sign;

  crypto = require('crypto');

  exports.encode = function(payload, secret) {
    var algorithm, header, jwt;
    algorithm = 'HS256';
    header = {
      typ: 'JWT',
      alg: algorithm
    };
    jwt = (base64Encode(JSON.stringify(header))) + '.' + (base64Encode(JSON.stringify(payload)));
    return jwt + '.' + sign(jwt, secret);
  };

  exports.decode = function(token, secret) {
    var hdr, payload, pieces;
    pieces = token.split('.');
    if (pieces.length !== 3) {
      throw new Error("Invalid Token");
    }
    hdr = JSON.parse(base64Decode(pieces[0]));
    payload = JSON.parse(base64Decode(pieces[1]));
    return payload;
  };

  base64Encode = function(str) {
    return new Buffer(str).toString('base64');
  };

  base64Decode = function(str) {
    return new Buffer(str, 'base64').toString();
  };

  sign = function(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('base64');
  };

}).call(this);
