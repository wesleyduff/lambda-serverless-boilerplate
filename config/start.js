const vault = require( '/config/vault/vault.json' );
export default {
    service: 'regionalization-microservice',
    name: 'Regionalization Service',
    env: 'test',
    apiVersion: 'v1',
    apiGateway: {
        cacheInSeconds : 60
    },
    mongo: {
        options:{},
        url: "mongodb://127.0.0.1:27017/RavenData"
    },
    pushNotificationServiceKeys: {
        news: 'spectrum-news'
    },
    endpoints: {
    }
}