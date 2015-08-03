(function() {
  var mongoose;

  mongoose = require('mongoose');

  module.exports = function(opt) {
    return mongoose.connect(opt.db);
  };

}).call(this);
