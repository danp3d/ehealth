(function() {
  var app, env, opt;

  app = require('express')();

  env = process.env.NODE_ENV || 'development';

  opt = require('./configs/environment')[env];

  require('./configs/mongoose')(opt);

  require('./configs/express')(app, opt);

  require('./configs/routes')(app, opt);

  app.listen(opt.port);

  console.log("Listening on port: " + opt.port);

  console.log("Using database: " + opt.db);

}).call(this);
