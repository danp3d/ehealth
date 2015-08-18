User    = require './../models/userMdl'
jwt     = require 'jwt-simple'
https   = require 'https'
bcrypt  = require 'bcrypt-nodejs'

class UserCtrl
    secret: 's3cr3tm4t3'

    createToken: (user, req, res) =>
        # Generate token
        payload = iss: req.hostname, sub: user.id
        token = jwt.encode payload, @secret

        # Send response
        res.status 200
        res.send user: user.toJSON(), "token": token
    
    createUser: (req, res) =>
        self = this
        # Get the post data (parsed via body-parser)
        data = req.body
        
        # Validate data
        if not (data.email and data.pass and data.name and data.dob)
            console.log JSON.stringify data
            res.status 500
            res.send { message: "Invalid registration data" }
        else
            # Create the new user
            newUsr = new User
                email: data.email
                pass: data.pass
                name: data.name
                dob: data.dob

            # Try to save it
            newUsr.save (err) ->
                if err
                    res.status 500
                    res.send err
                else
                    self.createToken newUsr, req, res

    updateUserProfile: (req, res) =>
        self = this
        # Get post data
        data = req.body
        console.log JSON.stringify data
        
        User.findOne email: data.user.email, (err, user) ->
            throw err if err
            if not user
                res.status(500).send message: "User not found"
            else
                user.name = data.user.name
                user.dob = data.user.dob
                user.sex = data.user.sex
                user.height = data.user.height
                user.weight = data.user.weight
                user.activityFactor = data.user.activityFactor
                user.bodyFat = data.user.bodyFat
                user.workout = data.user.workout
                user.vo2Max = data.user.vo2Max
                user.restCF = data.user.restCF
                user.bloodPressure = data.user.bloodPressure
                user.objective = data.user.objective
                user.objectiveCalories = data.user.objectiveCalories
                console.log JSON.stringify data.user
                user.save (err) ->
                    if err
                        res.status(500).send "error": err
                    else
                        res.status(200).send "user": user
                    

    loginUser: (req, res) =>
        self = this
        data = req.body
        User.findOne email: data.email, (err, user) ->
            console.log err
            console.log JSON.stringify user
            throw err if err
            if not user
                res.status(401).send message: "Invalid credentials" 
            else
                user.comparePass data.pass, (err, validPass) ->
                    throw err if err

                    if not validPass
                        res.status(401).send message: "Invalid credentials"
                    else
                        self.createToken user, req, res
                    
    oauthLogin: (req, res) =>
        self = this
        data = req.body
        if data.email and data.accessToken
            options = 
                host: "graph.facebook.com"
                path: "/me?access_token=" + data.accessToken
            
            # Get facebook info
            self.getFbUserInfo data.accessToken, (err, response) ->
                if data.email != response.email
                    console.log response
                    res.status(401).send message: "Invalid emails" 
                else 
                    # find user
                    User.findOne email: data.email, (err, user) ->
                        throw err if err    
                        # not found? Create a new one
                        if not user
                            self.registerUserWithOauth data.email, data.provider, data.accessToken, res, req
                        else
                            self.loginUserWithOauth user, data.provider, data.accessToken, res, req
    
    # Facebook - Get user info
    getFbUserInfo: (accessToken, callback) ->
        options = 
            host: "graph.facebook.com"
            path: "/me?access_token=" + accessToken

        # Get facebook info
        fbjson = '';
        fbreq = https.get options, (response) ->
            response.on 'data', (chunk) ->
                fbjson += chunk
            response.on 'end', ->
                console.log fbjson
                data = JSON.parse fbjson
                callback null, data
        fbreq.on 'error', (err) ->
            callback err, null
    
    # Helper function to actually login
    loginUserWithOauth: (user, provider, token, res, req) =>
        self = this
        # Remove previous tokens for this provider
        matching = user.oauths.filter((oauth) -> oauth.provider == provider).pop()
        if typeof matching is "object"
            user.oauths.id(matching.id).remove()
        else if matching
            matching.forEach (oauth) ->
                user.oauths.id(oauth.id).remove()
        
        # now create the new one
        user.oauths.push
            provider: provider
            token: token
            
        # Save new token
        user.save (err) ->
            if err
                res.status 500
                res.send err
            else
                self.createToken user, req, res
        
    # Helper function to register a new user based on oauth login
    registerUserWithOauth: (email, provider, token, res, req) =>
        self = this
        # Generate random password
        bcrypt.genSalt 10, (err, salt) ->
            return next(err) if err

            # create object
            user = new User
                email: email
                pass: salt

            # insert the oauth token
            user.oauths.push 
                provider: provider
                token: token

            # save new user and return the response
            user.save (err) ->
                if err
                    res.status 500
                    res.send err
                else
                    self.createToken user, req, res

# Export object
ctrl = new UserCtrl()
module.exports = ctrl
    
                
    