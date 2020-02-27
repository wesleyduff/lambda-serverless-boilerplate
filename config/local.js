const vault = require( '/config/vault/vault.json' );
export default{
    service: 'weather-microservice',
    name: 'Weather Service',
    apiVersion: 'v2',
    apiGateway: {
        cacheInSeconds : 60
    },
    environment: {
        minikube: false,
        local: true
    },
    mongo: {
        url: "mongodb://host.docker.internal:27017/RavenData",
        options: {}
    },
    endpoints: {
        wsi : {
            location: {
                convertZipCodeToLatLong: zipCode => `https://api.weather.com/v3/location/point?postalKey=${zipCode}:US&language=en-US&format=json&apiKey=22d5586ce6f047ef95586ce6f057efac`
            },
            daily: {
                getUrl: (oLatLong, clientID) => `https://api.weather.com/v3/wx/forecast/daily/10day/custom?geocode=${oLatLong.latitude},${oLatLong.longitude}&format=json&units=e&language=en-US&clientId=${clientID}&apiKey=22d5586ce6f047ef95586ce6f057efac`
            }
        }
    }
}