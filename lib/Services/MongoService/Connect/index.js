import { MongoClient } from 'mongodb';
import config from '../con'

class MongoConnectionService {
    constructor(){
        console.log(`Instantiated MONGO CONNECTION SERVICE ------( service )`);
        this.client = null;
    }

    async connect(config){
        try{
            if((this.client && !this.client.isConnected()) || (this.client === null)){
                console.log('CONNECTING --------------------');
                const url = process.env.NODE_ENV === 'test'
                    ? await memoryServer.getConnectionString()
                    : config.mongo.url;
                const _options = process.env.NODE_ENV === 'local'
                    ? {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    }
                    : config.mongo.options;

                this.client = await MongoClient.connect(url, _options)
                console.log('Connected Client ----------------')
            } else if(this.client && this.client.isConnected()) {
                console.log('Client allready connected - re-using connection');
            }
            console.log('CONNECTED____');

            return this.client.db('RavenData');

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

module.exports = new MongoConnectionService(); //we only ever need one of these. So singleton is used here.