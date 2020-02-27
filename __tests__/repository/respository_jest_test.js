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
        if(process.env.ENVIRONMENT === 'test'){
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const memoryServer = new MongoMemoryServer();
            MongoConnectService.setMemoryServer(memoryServer)
        }
        //mongoConnectService = new MongoConnectService();
        db = await MongoConnectService.connect(config);
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

    describe('Testing adding a new MARKET to the MARKET collection for a state node', () => {
        let repository = null;
        const ut_state_node_shell =
            {
                state: 'UT',
                level: CONSTANTS.CONSUMER_ENUM.STATE,
                nationalCollection : nationalCollection,
                stateCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.STATE,
                    collections: [
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

        //populate db
        beforeAll((done) => {
            repository = new Repository(mongoConnectService);
            db.collection('regionPath')
                .insert(ut_state_node_shell, (error, result) => {
                    if(error){
                        fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                        done();
                    }

                    console.log(`Result from insert -= before add collection to level : ${utils.inspect(result)}`);
                    done();
                })
        })

        it('should add a new MARKET item to the MARKET collection within a state node', async function (done) {
            expect(ut_state_node_shell.marketCollection.collections.length).toEqual(0);
            console.log('searching ----')
            try{
                const result = await repository.addCollectionToLevelCollection(
                    {'state': 'UT'},
                    'marketCollection',
                    {
                                zipCodes: [98455],
                                displayName: 'UT-SaltLake',
                                languages: [
                                    CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_APP
                                ],
                                paths:
                                    {
                                        [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_APP]: '/us/ut/app/saltlake/sandy?lang=en'
                                    }

                            }
                )
                console.log('found ----')
                expect(result.value.marketCollection.collections.length).toBe(1)
                done()
            } catch(exception){
                console.log('NOT found ----')
                fail(`Exception : ALERT : -> new colletion to level collection : exception throw : ${utils.inspect(exception)}`);
                done()
            }

        });
    })

    describe('Testing deleting a MARKET from the MARKET collection for a state node', () => {
        let repository = null;
        const wy_state_node_shell =
            {
                state: 'WY',
                level: CONSTANTS.CONSUMER_ENUM.STATE,
                nationalCollection : nationalCollection,
                stateCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.STATE,
                    collections: [
                    ]
                },
                marketCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.MARKET,
                    collections: [
                        {
                            zipCodes: [98455],
                            displayName: 'WY-HomeTown',
                            languages: [
                                CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_APP
                            ],
                            paths:
                                {
                                    [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_APP]: '/us/wy/app/hometown/luxington?lang=en'
                                }

                        }
                    ]
                },
                neighborhoodCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.NEIGHBORHOOD,
                    collections: [

                    ]
                }
            }

        //populate db
        beforeAll((done) => {
            repository = new Repository(mongoConnectService);
            db.collection('regionPath')
                .insert(wy_state_node_shell, (error, result) => {
                    if(error){
                        fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                        done();
                    }

                    console.log(`Result from insert -= before add collection to level : ${utils.inspect(result)}`);
                    done();
                })
        })

        it('should delete a MARKET item from the MARKET collection within a state node', async function (done) {
            console.log('searching ----')
            try{
                const beforeRemoval = await repository.getStateNode('WY')
                const result = await repository.deleteCollectionFromLevelCollectionCollections(
                    {'state': 'WY'},
                    'marketCollection',
                    {'displayName': 'WY-HomeTown' }
                )
                console.log('found ----')
                expect(beforeRemoval[0].marketCollection.collections.length).toBe(1);
                expect(result.value.marketCollection.collections.length).toBe(0);
                done()
            } catch(exception){
                console.log('NOT found ----')
                fail(`Exception : ALERT : -> new colletion to level collection : exception throw : ${utils.inspect(exception)}`);
                done()
            }

        });
    })

    describe('Testing removing a zip code from a levelCollection collections zip code array', () => {
        let repository = null;
        const wy_state_node_shell =
            {
                state: 'NY',
                level: CONSTANTS.CONSUMER_ENUM.STATE,
                nationalCollection : nationalCollection,
                stateCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.STATE,
                    collections: [
                    ]
                },
                marketCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.MARKET,
                    collections: [
                        {
                            zipCodes: [98455, 78660],
                            displayName: 'NY-HomeTown',
                            languages: [
                                CONSTANTS.SUPPORTED_LANGUAGES_ENUM.EN_US_APP
                            ],
                            paths:
                                {
                                    [CONSTANTS.SUPPORTED_LANGUAGES_ENUM.SP_APP]: '/us/ny/app/hometown/luxington?lang=en'
                                }

                        }
                    ]
                },
                neighborhoodCollection: {
                    level: CONSTANTS.CONSUMER_ENUM.NEIGHBORHOOD,
                    collections: [

                    ]
                }
            }

        //populate db
        beforeAll((done) => {
            repository = new Repository(mongoConnectService);
            db.collection('regionPath')
                .insert(wy_state_node_shell, (error, result) => {
                    if(error){
                        fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                        done();
                    }

                    console.log(`Result from insert -= before add collection to level : ${utils.inspect(result)}`);
                    done();
                })
        })

        it('should remove a zip code from the MARKET collection within a state node', async function (done) {
            console.log('searching ----')
            try{
                const beforeRemoval = await repository.getStateNode('NY');
                const result = await repository.deleteZipCodeFromLevelCollectionCollections(
                    {
                        'state': 'NY',
                        [`${CONSTANTS.CONSUMER_COLLECTIONS_ENUM.MARKETCOLLECTION}.collections.zipCodes`] : 78660
                    },
                    'marketCollection',
                    78660
                )
                console.log('found ----')
                expect(beforeRemoval[0].marketCollection.collections[0].zipCodes.includes(78660)).toBe(true);
                expect(result.value.marketCollection.collections[0].zipCodes.includes(78660)).toBe(false);
                done()
            } catch(exception){
                console.log('NOT found ----')
                fail(`Exception : ALERT : -> new colletion to level collection : exception throw : ${utils.inspect(exception)}`);
                done()
            }

        });

        it('should add a zip code to the MARKET collection within a state node', async function (done) {
            try{
                const beforeRemoval = await repository.getStateNode('NY');
                const result = await repository.addZipCodetoLevelCollectionCollections(
                    {
                        'state': 'NY',
                        [`${CONSTANTS.CONSUMER_COLLECTIONS_ENUM.MARKETCOLLECTION}.collections.displayName`] : 'NY-HomeTown'
                    },
                    'marketCollection',
                    90210
                )
                console.log('found ----')
                expect(beforeRemoval[0].marketCollection.collections[0].zipCodes.includes(90210)).toBe(false);
                expect(result.value.marketCollection.collections[0].zipCodes.includes(90210)).toBe(true);
                done()
            } catch(exception){
                console.log('NOT found ----')
                fail(`Exception : ALERT : -> Could not add zipcode : exception throw : ${utils.inspect(exception)}`);
                done()
            }

        });
    })

    
    
    
});