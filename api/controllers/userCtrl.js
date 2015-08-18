(function() {
  var User, UserCtrl, bcrypt, ctrl, https, jwt,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  User = require('./../models/userMdl');

  jwt = require('jwt-simple');

  https = require('https');

  bcrypt = require('bcrypt-nodejs');

  UserCtrl = (function() {
    function UserCtrl() {
      this.registerUserWithOauth = bind(this.registerUserWithOauth, this);
      this.loginUserWithOauth = bind(this.loginUserWithOauth, this);
      this.oauthLogin = bind(this.oauthLogin, this);
      this.loginUser = bind(this.loginUser, this);
      this.updateUserProfile = bind(this.updateUserProfile, this);
      this.createUser = bind(this.createUser, this);
      this.createToken = bind(this.createToken, this);
    }

    UserCtrl.prototype.secret = 's3cr3tm4t3';

    UserCtrl.prototype.createToken = function(user, req, res) {
      var payload, token;
      payload = {
        iss: req.hostname,
        sub: user.id
      };
      token = jwt.encode(payload, this.secret);
      res.status(200);
      return res.send({
        user: user.toJSON(),
        "token": token
      });
    };

    UserCtrl.prototype.createUser = function(req, res) {
      var data, newUsr, self;
      self = this;
      data = req.body;
      if (!(data.email && data.pass && data.name && data.dob)) {
        console.log(JSON.stringify(data));
        res.status(500);
        return res.send({
          message: "Invalid registration data"
        });
      } else {
        newUsr = new User({
          email: data.email,
          pass: data.pass,
          name: data.name,
          dob: data.dob
        });
        return newUsr.save(function(err) {
          if (err) {
            res.status(500);
            return res.send(err);
          } else {
            return self.createToken(newUsr, req, res);
          }
        });
      }
    };

    UserCtrl.prototype.updateUserProfile = function(req, res) {
      var data, self;
      self = this;
      data = req.body;
      console.log(JSON.stringify(data));
      return User.findOne({
        email: data.user.email
      }, function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          return res.status(500).send({
            message: "User not found"
          });
        } else {
          user.name = data.user.name;
          user.dob = data.user.dob;
          user.sex = data.user.sex;
          user.height = data.user.height;
          user.weight = data.user.weight;
          user.activityFactor = data.user.activityFactor;
          user.bodyFat = data.user.bodyFat;
          user.workout = data.user.workout;
          user.vo2Max = data.user.vo2Max;
          user.restCF = data.user.restCF;
          user.bloodPressure = data.user.bloodPressure;
          user.objective = data.user.objective;
          user.objectiveCalories = data.user.objectiveCalories;
          console.log(JSON.stringify(data.user));
          return user.save(function(err) {
            if (err) {
              return res.status(500).send({
                "error": err
              });
            } else {
              return res.status(200).send({
                "user": user
              });
            }
          });
        }
      });
    };

    UserCtrl.prototype.loginUser = function(req, res) {
      var data, self;
      self = this;
      data = req.body;
      return User.findOne({
        email: data.email
      }, function(err, user) {
        console.log(err);
        console.log(JSON.stringify(user));
        if (err) {
          throw err;
        }
        if (!user) {
          return res.status(401).send({
            message: "Invalid credentials"
          });
        } else {
          return user.comparePass(data.pass, function(err, validPass) {
            if (err) {
              throw err;
            }
            if (!validPass) {
              return res.status(401).send({
                message: "Invalid credentials"
              });
            } else {
              return self.createToken(user, req, res);
            }
          });
        }
      });
    };

    UserCtrl.prototype.oauthLogin = function(req, res) {
      var data, options, self;
      self = this;
      data = req.body;
      if (data.email && data.accessToken) {
        options = {
          host: "graph.facebook.com",
          path: "/me?access_token=" + data.accessToken
        };
        return self.getFbUserInfo(data.accessToken, function(err, response) {
          if (data.email !== response.email) {
            console.log(response);
            return res.status(401).send({
              message: "Invalid emails"
            });
          } else {
            return User.findOne({
              email: data.email
            }, function(err, user) {
              if (err) {
                throw err;
              }
              if (!user) {
                return self.registerUserWithOauth(data.email, data.provider, data.accessToken, res, req);
              } else {
                return self.loginUserWithOauth(user, data.provider, data.accessToken, res, req);
              }
            });
          }
        });
      }
    };

    UserCtrl.prototype.getFbUserInfo = function(accessToken, callback) {
      var fbjson, fbreq, options;
      options = {
        host: "graph.facebook.com",
        path: "/me?access_token=" + accessToken
      };
      fbjson = '';
      fbreq = https.get(options, function(response) {
        response.on('data', function(chunk) {
          return fbjson += chunk;
        });
        return response.on('end', function() {
          var data;
          console.log(fbjson);
          data = JSON.parse(fbjson);
          return callback(null, data);
        });
      });
      return fbreq.on('error', function(err) {
        return callback(err, null);
      });
    };

    UserCtrl.prototype.loginUserWithOauth = function(user, provider, token, res, req) {
      var matching, self;
      self = this;
      matching = user.oauths.filter(function(oauth) {
        return oauth.provider === provider;
      }).pop();
      if (typeof matching === "object") {
        user.oauths.id(matching.id).remove();
      } else if (matching) {
        matching.forEach(function(oauth) {
          return user.oauths.id(oauth.id).remove();
        });
      }
      user.oauths.push({
        provider: provider,
        token: token
      });
      return user.save(function(err) {
        if (err) {
          res.status(500);
          return res.send(err);
        } else {
          return self.createToken(user, req, res);
        }
      });
    };

    UserCtrl.prototype.registerUserWithOauth = function(email, provider, token, res, req) {
      var self;
      self = this;
      return bcrypt.genSalt(10, function(err, salt) {
        var user;
        if (err) {
          return next(err);
        }
        user = new User({
          email: email,
          pass: salt
        });
        user.oauths.push({
          provider: provider,
          token: token
        });
        return user.save(function(err) {
          if (err) {
            res.status(500);
            return res.send(err);
          } else {
            return self.createToken(user, req, res);
          }
        });
      });
    };

    return UserCtrl;

  })();

  ctrl = new UserCtrl();

  module.exports = ctrl;

}).call(this);
