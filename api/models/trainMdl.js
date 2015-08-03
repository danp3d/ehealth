(function() {
  var Train, TrainSchema, mongoose;

  mongoose = require('mongoose');

  TrainSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date_created: Date,
    train_date: Date,
    type: String,
    durationMinutes: Number,
    intensity: Number
  });

  Train = mongoose.model('Train', TrainSchema);

  module.exports = Train;

}).call(this);
