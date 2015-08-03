mongoose    = require 'mongoose'

# Generate schema
TransScheduleSchema = new mongoose.Schema
    # Each transaction belongs to an user
    user_id: 
        type: mongoose.Schema.Types.ObjectId 
        ref: 'User'
    
    # From due_date we can define the next trans date using repeat_every (e.g. 3) and repeat_type (e.g. "week")
    date_created: Date
    due_date: Date
    repeat_every: Number
    repeat_type: String
    
    value: Number
    is_income: Boolean

# Generate actual model
TransSchedule = mongoose.model 'TransSchedule', TransScheduleSchema

# Export it
module.exports = TransSchedule