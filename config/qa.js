const vault = require( '/config/vault/vault.json' );

export default{
        service: 'weather-microservice',
        name: 'Weather Service',
        apiVersion: 'v2',
        apiGateway: {
            cacheInSeconds : 60
        },
        mongo: {
            options: {
                readPreference: 'nearest',
                poolSize: 5,
                w: 'majority',
                connectWithNoPrimary: true,
                replicaSet: process.env.REPLICA_SET || 'raven-qa',
                tlsAllowInvalidCertificates: true,
            },
            url: `mongodb://${vault.mongo_auth_userpassword}@raven-mongo:27017/RavenData?ssl=true&sslInvalidHostNameAllowed=true`
        },
        endpoints: {
            wsi : {
                location: {
                    convertZipCodeToLatLong: zipCode => `https://api.weather.com/v3/location/point?postalKey=${zipCode}:US&language=en-US&format=json&apiKey=${vault.wsi_api_key}`
                },
                daily: {
                    getUrl: (oLatLong, clientID) => `https://api.weather.com/v3/wx/forecast/daily/10day/custom?geocode=${oLatLong.latitude},${oLatLong.longitude}&format=json&units=e&language=en-US&clientId=${clientID}&apiKey=${vault.wsi_api_key}`
                }
            }

        }
    }
