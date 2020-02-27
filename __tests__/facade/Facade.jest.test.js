import "@babel/polyfill"
import Facade from '../../lib/Facade';
import {CONSTANTS} from "../../Pacakges";
import {MongoConnectService} from "../../lib/Services";
import config from "../../config";
import Repository from "../../lib/Repository";
import utils from "util";

/*
DATA
 */

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



/* --- end data */

describe('Testing the facade - entry points ---> ', () => {

    /*
    SETUP and tear down of MOCK DB
     */
    let mongoConnectService = null,
        db = null;

    beforeAll(async (done) => {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const memoryServer = new MongoMemoryServer();
        MongoConnectService.setMemoryServer(memoryServer)
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


    describe('ENDPOINT TESTING ---> ', () => {

        /*
        Add data to MOCK database
         */
        let repository = null;

        //populate db
        beforeAll((done) => {
            repository = new Repository();
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

        describe('ENDPOINT : get state node : /region/:STATE ---> ', () => {

            it('should return a state node from the database', async function (done) {
                try{
                    const response = await Facade.entry_database_getStateNode('TX');

                    console.log('--- got response')
                    expect(response.result.length).toBe(1);
                    console.log('--- done -should return a state node from the database')
                    done();
                } catch(exception){
                    fail(`Failed : Could not get state node from facade entry point : error => ${utils.inspect(exception)}`);
                    done();
                }
            });


        })


    })



})