const vault = require( '/config/vault/serverless/vault.json' );
export default {
    service: 'serverless-microservice',
    name: 'Serverless Demo Service',
    env: 'DEV',
    apiVersion: 'v1',
    apiGateway: {
        cacheInSeconds : 60
    },
    mongo: {
        options:{},
        url: `mongodb+srv://${vault.mongo.username}:${vault.mongo.password}@${vault.mongo.cluster}/test?retryWrites=true&w=majority`
    },
    endpoints: {
    }
}