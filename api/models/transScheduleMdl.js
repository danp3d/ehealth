(function() {
  var TransSchedule, TransScheduleSchema, mongoose;

  mongoose = require('mongoose');

  TransScheduleSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date_created: Date,
    due_date: Date,
    repeat_every: Number,
    repeat_type: String,
    value: Number,
    is_income: Boolean
  });

  TransSchedule = mongoose.model('TransSchedule', TransScheduleSchema);

  module.exports = TransSchedule;

}).call(this);
