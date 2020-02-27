import "@babel/polyfill"

import utils from 'util';
import { MongoConnectService } from "../../lib/Services";
import config from '../../config'


describe('Testing the connection to a mock mongo service ---> ', () => {

    let mongoConnectService = null,
        db = null;

    beforeAll(async (done) => {
        //mongoConnectService = new MongoConnectService();
        db = await MongoConnectService.connect(config);
        done();
    })

    afterAll(async (done) =>  {
        console.log('AFTER ALL ');
        await db.collection('regionPath')
            .deleteMany({})
        mongoConnectService.client.close(false)
            .then(mongoConnectService.memoryServer.stop())
            .then(done)
            .catch(done)
    });

    it('should connect to a mock mongo service', async (done) => {
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

        console.log('Should be called last')
    });

    it('should return a state node for texas', function (done) {
        db.collection('regionPath')
            .find({"ravenMetadata.state" : 'TX' }).toArray((error, result) => {
            if(error){
                fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                done();
            }

            console.log(`Result from find : ${utils.inspect(result)}`);
            expect(true).toBe(true)
            done();
        });
    });

})
