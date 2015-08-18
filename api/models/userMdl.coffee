bcrypt      = require 'bcrypt-nodejs'
mongoose    = require 'mongoose'

# Generate schema
UserSchema = new mongoose.Schema
    email: String
    pass: String
    name: String
    dob: Date
    sex: String
    bodyFat: Number
    height: Number
    weight: Number
    activityFactor: Number
    workout: {
        timesPerWeek: Number
        cardio: {
            intensity: Number
            duration: Number
        }
        strength: {
            intensity: Number
            duration: Number
        }
    }
    vo2Max: Number
    restCF: Number
    bloodPressure: {
        systolic: Number
        diastolic: Number
    }
    objective: String
    objectiveCalories: Number
    periodization: {
        percentage: { cardio: Number, strength: Number }
        toIncrease: Number
        startDate: Date
        calendar: [{ date: Date, intensity: Number }]
    }
    oauths: [{provider: String, token: String}]
    training: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Train' }]
    

# BeforeSave trigger: hash password if necessary
UserSchema.pre 'save', (next) ->
    # If password isn't modified, just return
    return next() if not @isModified 'pass'
    user = @

    # Generate salt
    bcrypt.genSalt 10, (err, salt) ->
        return next(err) if err
        user.salt = salt

        # Now hash the password
        bcrypt.hash user.pass, user.salt, null, (err, hashed_pass) ->
            return next(err) if err
            user.pass = hashed_pass

            # All done, finish saving
            next()

# Hide password
UserSchema.methods.toJSON = ->
    user = @toObject()
    delete user.pass
    return user
    
# Validate password
UserSchema.methods.comparePass = (pass, callback) ->
    bcrypt.compare(pass, @pass, callback)

# Generate actual model
User = mongoose.model 'User', UserSchema

# Export it
module.exports = User