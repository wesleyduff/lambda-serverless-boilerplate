import "@babel/polyfill"
import Repository from '../../lib/Repository';
import {MongoConnectService} from "../../lib/Services";
import config from "../../config";
import utils from "util";
import { CONSTANTS } from '../../Pacakges'

const nationalCollection = {
    level: CONSTANTS.CONSUMER_ENUM.NATIONAL,
    paths:
        {
            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB] : '/us/',
            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_WEB] : '/us/?lang=sp',
            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_APP] : '/us/',
            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_APP] : '/us/?lang=sp'
        }

}
const state_tx_db_node =
    {
        state: 'TX',
        level: CONSTANTS.CONSUMER_ENUM.STATE,
        nationalCollection : nationalCollection,
        stateCollection: {
            level: CONSTANTS.CONSUMER_ENUM.STATE,
            collections: [
                {
                    zipCodes: [78660],
                    displayName: 'TX',
                    languages: [
                        CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB
                    ],
                    paths:
                        {
                            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB] : '/us/tx/web/austin/austin-park_meadows',
                        }

                }
            ]
        },
        marketCollection: {
            level: CONSTANTS.CONSUMER_ENUM.MARKET,
            collections: [
                {
                    zipCodes: [78661],
                    displayName: 'TX-Austin',
                    languages: [
                        CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_APP
                    ],
                    paths:
                        {
                            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_APP]: '/us/tx/app/austin/austin-park_meadows?lang=sp'
                        }

                }
            ]
        },
        neighborhoodCollection: {
            level: CONSTANTS.CONSUMER_ENUM.NEIGHBORHOOD,
            collections: [
                {
                    zipCodes: [78660, 78661],
                    displayName: 'Neighborhood 1',
                    languages: [
                        CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_APP,
                        CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_WEB
                    ],
                    paths: {
                        [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_APP]: '/us/tx/austin/austin-park_meadows',
                        [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_WEB]: '/us/tx/austin/austin-park_meadows?lang=sp'
                    }
                }
            ]
        }
    }



const state_co_db_node =
    {
        state: 'CO',
        level: CONSTANTS.CONSUMER_ENUM.STATE,
        nationalCollection : nationalCollection,
        stateCollection: {
            level: CONSTANTS.CONSUMER_ENUM.STATE,
            collections: [
                {
                    zipCodes: [80104],
                    displayName: 'CO',
                    languages: [
                        CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB
                    ],
                    paths:
                        {
                            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB] : '/us/co/web/austin/austin-park_meadows',
                        }

                }
            ]
        },
        marketCollection: {
            level: CONSTANTS.CONSUMER_ENUM.MARKET,
            collections: [

            ]
        },
        neighborhoodCollection: {
            level: CONSTANTS.CONSUMER_ENUM.NEIGHBORHOOD,
            collections: [

            ]
        }
    }




const state_tx_node_api_response =  {
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
                .insert(state_tx_db_node, (error, result) => {
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
            expect(result[0].state).toEqual('TX');
            expect(result[0].level).toBe('STATE');
            done();
        });

        it('should update the state node with new paths for MARKET', async function () {
            const result = await repository.updateStateNode({
                    'state': 'TX',
                    'stateCollection.collections.displayName': 'TX'
                },
                'stateCollection',
                {
                    zipCodes: [78660, 78661, 78663],
                    displayName: 'TX-change',
                    languages: [
                        CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB
                    ],
                    paths:
                        {
                            [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_WEB] : '/us/tx/web/austin/austin-park_meadows',
                        }

                }
            );
            const resultFind = await repository.getStateNode('TX');

            expect(resultFind[0].stateCollection.collections[0].zipCodes.length).toBe(3);
            expect(resultFind[0].stateCollection.collections[0].zipCodes.includes(78661)).toEqual(true)
        });

        it('should delete level', function () {
            
        });

    })

    describe('Testing inserting state nodes into db ---> ', () => {
        let repository = null;

        //populate db
        beforeAll((done) => {
            repository = new Repository(mongoConnectService);
            done();
        })


        it('should insert a state node into the database', async function () {
            const resultFromInsert = await repository.addStateNode(state_co_db_node);
            expect(resultFromInsert.result.n).toEqual(1);
            expect(resultFromInsert.result.ok).toEqual(1);
        });
    })

    
    
    
});