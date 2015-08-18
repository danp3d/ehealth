(function() {
  var User, UserSchema, bcrypt, mongoose;

  bcrypt = require('bcrypt-nodejs');

  mongoose = require('mongoose');

  UserSchema = new mongoose.Schema({
    email: String,
    pass: String,
    name: String,
    dob: Date,
    sex: String,
    bodyFat: Number,
    height: Number,
    weight: Number,
    activityFactor: Number,
    workout: {
      timesPerWeek: Number,
      cardio: {
        intensity: Number,
        duration: Number
      },
      strength: {
        intensity: Number,
        duration: Number
      }
    },
    vo2Max: Number,
    restCF: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    objective: String,
    objectiveCalories: Number,
    periodization: {
      percentage: {
        cardio: Number,
        strength: Number
      },
      toIncrease: Number,
      startDate: Date,
      calendar: [
        {
          date: Date,
          intensity: Number
        }
      ]
    },
    oauths: [
      {
        provider: String,
        token: String
      }
    ],
    training: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train'
      }
    ]
  });

  UserSchema.pre('save', function(next) {
    var user;
    if (!this.isModified('pass')) {
      return next();
    }
    user = this;
    return bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      user.salt = salt;
      return bcrypt.hash(user.pass, user.salt, null, function(err, hashed_pass) {
        if (err) {
          return next(err);
        }
        user.pass = hashed_pass;
        return next();
      });
    });
  });

  UserSchema.methods.toJSON = function() {
    var user;
    user = this.toObject();
    delete user.pass;
    return user;
  };

  UserSchema.methods.comparePass = function(pass, callback) {
    return bcrypt.compare(pass, this.pass, callback);
  };

  User = mongoose.model('User', UserSchema);

  module.exports = User;

}).call(this);
