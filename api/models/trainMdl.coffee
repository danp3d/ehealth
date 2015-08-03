mongoose    = require 'mongoose'

# Generate schema
TrainSchema = new mongoose.Schema
    # Each record belongs to an user
    user_id: 
        type: mongoose.Schema.Types.ObjectId 
        ref: 'User'
        
    date_created: Date
    train_date: Date
    type: String
    durationMinutes: Number
    intensity: Number

# Generate actual model
Train = mongoose.model 'Train', TrainSchema

# Export it
module.exports = Train
