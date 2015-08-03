module.exports =
    development:
        port: process.env.PORT || 3030
        db: "mongodb://localhost/ehealth"
        secret: "s3cr3tm4t3"
        
    production:
        port: process.env.PORT || 80
        db: "mongodb://mmapp:m0n3y!@ds053937.mongolab.com:53937/ehealth"
        secret: "s3cr3tm4t3"
