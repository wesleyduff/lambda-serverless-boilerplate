import "@babel/polyfill"
import Repository from '../../lib/Repository';
import Facade from '../../lib/Facade';

describe('Testing the repository in lib', function() {

    it('should have a method in the Facade to create a new Repository or return an existing one : Singleton', function () {
        expect(typeof Facade._instantiateRepository).toBe('function')
    });

    it('should return a new Repository', function () {
        expect(Facade.Repository).toBe(null);
        Facade._instantiateRepository();
        expect(Facade.Repository instanceof Repository).toBe(true)
    });

    it('should have a method called getStateNode', function() {
        expect(typeof Repository.getStateNode).toBe('function');
    });
    
    describe('Testing get state node from db ---> ', () => {

        const state_tx_node =  {
            "ravenMetadata": {
                "zipCode":"90803",
                "state":"TX"
            },
            "paths": [
                {
                    "level":"MARKET",
                    "displayName":"TX-Austin",
                    "path": "/us/tx/austin/",
                    "language":"en",
                    "type":"app"
                },
                {
                    "level":"NATIONAL",
                    "displayName":"National",
                    "path": "/us",
                    "language":"sp",
                    "type":"app"
                },
                {
                    "level":"NEIGHBORHOOD",
                    "displayName":"TX-Austin-Park Meadows",
                    "path": "/us/tx/austin/austin-park_meadows",
                    "language":"en",
                    "type":"web"
                },
                {
                    "level":"STATE",
                    "displayName":"TX",
                    "path": "/us/tx",
                    "language":"sp",
                    "type":"web"
                }
            ]
        };


        it('should return a state node from the database', function () {
            
        });

    })
    
    
    
});