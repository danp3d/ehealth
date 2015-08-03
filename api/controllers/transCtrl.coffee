User            = require './../models/userMdl'
Transaction     = require './../models/transMdl'
TransSchedule   = require './../models/transScheduleMdl'
jwt             = require './../services/jwt'

class TransCtrl
    secret: 's3cr3tm4t3'
    
    getTransactions: (req, res) =>
        if not req.headers.authorization
            return res.status(401).send message: 'User not logged in'
            
        token = req.headers.authorization.split ' '
        payload = jwt.decode token[1], @secret
            
        data = [0, 1, 2, 3, 4, 5]
        res.status(200).send "data": data


#Export
ctrl = new TransCtrl()
module.exports = ctrl
    
