mongoose = require 'mongoose'

module.exports = (opt) ->
    mongoose.connect(opt.db)