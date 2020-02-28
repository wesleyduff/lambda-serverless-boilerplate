import "@babel/polyfill"
import Repository from '../../lib/Repository';
import {MongoConnectService} from "../../lib/Services";
import config from "../../config";
import utils from "util";
import { CONSTANTS } from '../../Pacakges'
import Facade from "../../lib/Facade";

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

describe('Testing Zip Code Endpoints ---> ', () => {
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

    describe('Testing the update delete or add of zip codes ---> ', () => {
        //populate db
        beforeAll((done) => {
            db.collection('regionPath')
                .insert(state_tx_db_node, (error, result) => {
                    if (error) {
                        fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                        done();
                    }

                    console.log(`Result from insert : ${utils.inspect(result)}`);
                    done();
                })

        })

        it('should add a zipcode to a current level collection ', async function (done) {
            try {
                const before = await Facade.entry_database_getStateNode('TX');
                const result = await Facade.entry_addUpdateDeleteZipCodeArray({
                    "query": {
                        "state": "TX",
                        "levelCollection": "marketCollection",
                        "displayName": "TX-Austin"
                    },
                    "newZipCodeArray": [1006, 1005, 1007]
                });

                expect(result.status).toBe(200);
                expect(before.response[0].marketCollection.collections[0].zipCodes.includes(78661)).toBe(true);
                expect(result.response.value.marketCollection.collections[0].zipCodes.length).toBe(3);
                expect(result.response.value.marketCollection.collections[0].zipCodes.includes(78661)).toBe(false);
                expect(result.response.value.marketCollection.collections[0].zipCodes.includes(1005)).toBe(true);
                expect(result.response.value.marketCollection.collections[0].zipCodes.indexOf(1005)).toBe(1);
                done();

            } catch (exception) {
                fail(`ERROR : ALERT : Could not add zip code to collections zip code array : error => ${utils.inspect(exception)}`);
                done()
            }
        })

    })

})
