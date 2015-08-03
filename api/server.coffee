app = require('express')()
env = process.env.NODE_ENV || 'development'
opt = require('./configs/environment')[env]

# Configs
require('./configs/mongoose') opt
require('./configs/express') app, opt
require('./configs/routes') app, opt

# Start app
app.listen opt.port
console.log "Listening on port: " + opt.port
console.log "Using database: " + opt.db