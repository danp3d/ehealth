express     = require 'express'
bodyparser  = require 'body-parser'

module.exports = (app, opts) ->
    # Body Parser: parses the POST values so we can use req.body
    app.use bodyparser.json()

    # View engine. Not used at the moment, but maybe later on :)
    app.set 'views', __dirname + '/../views'
    app.set 'view engine', 'jade'
    
    # Allow CORS
    app.use (req, res, next) ->
        res.header "Access-Control-Allow-Origin", "*"
        res.header "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"
        res.header "Access-Control-Allow-Headers", "Content-Type, Authorization"
        
        next()
    
    # Serve static files (front-end)
    app.use express.static __dirname + '/../../app/public'
