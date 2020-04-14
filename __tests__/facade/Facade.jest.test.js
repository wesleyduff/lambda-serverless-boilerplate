import "@babel/polyfill"
import Facade from '../../lib/Facade';
import {CONSTANTS} from "../../Pacakges";
import {MongoConnectService} from "../../lib/Services";
import config from "../../config";
import Repository from "../../lib/Repository";
import utils from "util";


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
       /* Delete any database additions you did in this test here */

        // Close the database
        mongoConnectService.client.close(false)
            .then(mongoConnectService.memoryServer.stop())
            .then(done)
            .catch(done)
    });


    describe('ENDPOINT TESTING ---> ', () => {


        //populate db
        beforeAll((done) => {
            /*
            Insert any data needed by the tests in this describe here
            Example below in comments
             */
            // db.collection('regionPath')
            //     .insert(state_tx_db_node, (error, result) => {
            //         if(error){
            //             fail(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
            //             done();
            //         }
            //
            //         console.log(`Result from insert : ${utils.inspect(result)}`);
            //         done();
            //     })

        })

        describe('ENDPOINT : get state node : /region/:STATE ---> ', () => {

            it('should return a state node from the database', async function (done) {
                try{
                    //setup


                    //expect
                    expect(true).toBe(true);

                    //if done is passed in.. call done.
                    //only needed for promises that are not async await
                    done();
                } catch(exception){
                    //make sure to fail response
                    fail(`Failed : Could not get state node from facade entry point : error => ${utils.inspect(exception)}`);
                    //call done if done is passed into the function for this test
                    done();
                }
            });


        })


    })



})