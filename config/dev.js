const vault = require( '/config/vault/vault.json' );

const config = {
    service: 'weather-microservice',
    name: 'Weather Service',
    apiVersion: 'v2',
    apiGateway: {
        cacheInSeconds : 60
    },
    mongo : {
      options : {
          useNewUrlParser: true
      },
        url : `mongodb+srv://slysop:Ab34125@cluster0-6iafy.mongodb.net/test?retryWrites=true&w=majority`
    },
    mongo_raven: {
        options: {
            readPreference: 'nearest',
            poolSize: 5,
            w: 'majority',
            connectWithNoPrimary: true,
            replicaSet: process.env.REPLICA_SET || 'raven-dev',
            tlsAllowInvalidCertificates: true,
        },
        url: `mongodb://${vault.mongo_auth_userpassword}@raven-mongo:27017/RavenData?ssl=true&sslInvalidHostNameAllowed=true`
    },
    endpoints: {

    }
}

export default config;