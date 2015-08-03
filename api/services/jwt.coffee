crypto = require 'crypto'

exports.encode = (payload, secret) ->
    algorithm = 'HS256'
    header = typ: 'JWT', alg: algorithm
    
    jwt = (base64Encode JSON.stringify header) + '.' + (base64Encode JSON.stringify payload)
    return jwt + '.' + sign(jwt, secret)
    
exports.decode = (token, secret) ->
    pieces = token.split '.'
    throw new Error("Invalid Token") if pieces.length != 3
    
    hdr = JSON.parse base64Decode pieces[0]
    payload = JSON.parse base64Decode pieces[1]
    
    return payload
    
base64Encode = (str) ->
    new Buffer(str).toString 'base64'
    
base64Decode = (str) ->
    new Buffer(str, 'base64').toString()
    
sign = (str, key) ->
    crypto.createHmac 'sha256', key
        .update str
        .digest 'base64'