(function() {
  var TransSchema, Transaction, mongoose;

  mongoose = require('mongoose');

  TransSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    trans_schedule_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransSchedule'
    },
    date_created: Date,
    due_date: Date,
    value: Number,
    is_income: Boolean
  });

  Transaction = mongoose.model('Transaction', TransSchema);

  module.exports = Transaction;

}).call(this);
