import "@babel/polyfill"
import Repository from '../../lib/Repository';
import {MongoConnectService} from "../../lib/Services";
import config from "../../config";
import utils from "util";

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

describe('Testing the repository in lib', function() {
    let mongoConnectService = null,
        db = null;

    beforeAll(async (done) => {
        mongoConnectService = new MongoConnectService();
        db = await mongoConnectService.connect(config);
        done();
    })

    afterAll(async (done) =>  {
        console.log('AFTER ALL --- deleting ');
        await db.collection('regionPath')
            .deleteMany({})
        mongoConnectService.client.close(false)
            .then(mongoConnectService.memoryServer.stop())
            .then(done)
            .catch(done)
    });

    xit('should have a method called getStateNode', function() {
        expect(typeof Repository.getStateNode).toBe('function');
    });
    
    describe('Testing get state node from db ---> ', () => {

        let repository = null;

        //populate db
        beforeAll((done) => {
            repository = new Repository(mongoConnectService);
            db.collection('regionPath')
                .insert(state_tx_node, (error, result) => {
                    if(error){
                        fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                        done();
                    }

                    console.log(`Result from insert : ${utils.inspect(result)}`);
                    expect(true).toBe(true)
                    done();
                })

        })

        it('should return a state node for texas', async function (done) {
            const result = await repository.getStateNode('TX');
            console.log(`result : ${utils.inspect(result)}`)
            expect(JSON.stringify(result[0].ravenMetadata)).toEqual("{\"zipCode\":\"90803\",\"state\":\"TX\"}");
            expect(result[0].ravenMetadata.state).toBe('TX');
            done();
        });

    })
    
    
    
});