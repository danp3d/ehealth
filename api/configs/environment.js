(function() {
  module.exports = {
    development: {
      port: process.env.PORT || 3030,
      db: "mongodb://localhost/ehealth",
      secret: "s3cr3tm4t3"
    },
    production: {
      port: process.env.PORT || 80,
      db: "mongodb://ehealth:3h34lth+$@ds033123.mongolab.com:33123/ehealth",
      secret: "s3cr3tm4t3"
    }
  };

}).call(this);
