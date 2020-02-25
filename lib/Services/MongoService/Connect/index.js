import { MongoClient } from 'mongodb';
import config from '../../../../config'

class MongoConnectionService {
    constructor(){
        console.log(`Instantiated MONGO CONNECTION SERVICE ------( service )`);
        this.client = null;
        this.connection = null;
        this.db = null;

        if(config.env === 'test'){
            const { MongoMemoryServer } = require('mongodb-memory-server');
            this.memoryServer = new MongoMemoryServer();
        }
    }

    async connect(config){
        try{
            if((this.client && !this.client.isConnected()) || (this.client === null)){
                console.log('CONNECTING --------------------');

                this.client = await MongoClient.connect(
                    config.env === 'test'
                        ? await this.memoryServer.getConnectionString()
                        : config.mongo.url,
                    config.mongo.options
                );

                console.log('Connected Client ----------------')
            } else if(this.client && this.client.isConnected()) {
                console.log('Client allready connected - re-using connection');
            }
            console.log('CONNECTED____');

            this.db = this.client.db('RavenData');
            return this.db;

        } catch(exception){
            console.error(`ERROR FROM MONGO CONNECTION : -> ${JSON.stringify(exception)}`);
            console.error(exception);
            console.error('unable to establish mongo connection');

            // wait 1500ms prior to exiting to avoid pm2 categorizing this as a code error
            return setTimeout(() => {
                console.info('-- exiting 1500ms after mongodb disconnect');
                process.exit(1);
            }, 1500);
        }
    }
}

module.exports = MongoConnectionService;