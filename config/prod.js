export default {
    service: 'serverless-microservice',
    name: 'Serverless Demo Service',
    env: 'PROD',
    apiVersion: 'v1',
    apiGateway: {
        cacheInSeconds : 60
    },
    mongo: {
        options:{},
        url: "mongodb://127.0.0.1:27017/RavenData"
    },
    endpoints: {
    }
}