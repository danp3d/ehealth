mongoose    = require 'mongoose'

# Generate schema
TransSchema = new mongoose.Schema
    # Each transaction belongs to an user
    user_id: 
        type: mongoose.Schema.Types.ObjectId 
        ref: 'User'
        
    # And each transaction may or may not be part of a schedule
    trans_schedule_id: 
        type: mongoose.Schema.Types.ObjectId
        ref: 'TransSchedule'
        
    date_created: Date
    due_date: Date
    value: Number
    is_income: Boolean

# Generate actual model
Transaction = mongoose.model 'Transaction', TransSchema

# Export it
module.exports = Transaction
