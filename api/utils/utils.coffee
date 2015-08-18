jwt      = require './../services/jwt'
secret   = 's3cr3tm4t3'

exports.getUserID = (req, res) =>
        if not req.headers.authorization
            return res.status(401).send message: 'User not logged in'
            
        token = req.headers.authorization.split ' '
        payload = jwt.decode token[1], secret
        user_id = payload.sub
        return user_id