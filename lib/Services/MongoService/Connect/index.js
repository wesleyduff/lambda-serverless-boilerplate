import { MongoClient } from 'mongodb';
import utils from 'util';

class MongoConnectionService {
    constructor(){
        console.log(`Instantiated MONGO CONNECTION SERVICE ------( service )`);
        this.client = null;
        this.connection = null;
        this.db = null;
        this.memoryServer = null;
    }

    setMemoryServer(memoryServer){
        this.memoryServer = memoryServer;
    }

    async connect(config){
        const self = this;
        return new Promise(async (resolve, reject) => {
            try{
                if((this.client && !this.client.isConnected()) || (this.client === null)){
                    console.log('CONNECTING --------------------');

                    const client = await new MongoClient.connect(
                        config.env === 'test'
                            ? await self.memoryServer.getConnectionString()
                            : config.mongo.url,
                        config.mongo.options);


                        console.log('Connected Client ----------------')
                        self.db = client.db("RavenData")
                        // perform actions on the collection object
                        self.client = client
                        return resolve(self.db);


                } else if(this.client && this.client.isConnected()) {
                    console.log('Client allready connected - re-using connection');
                }
                console.log('CONNECTED____');
                return resolve(self.db)

            } catch(exception){
                console.error(`ERROR FROM MONGO CONNECTION : -> ${JSON.stringify(exception)}`);
                console.error(exception);
                console.error('unable to establish mongo connection');
                reject(exception)
                // wait 1500ms prior to exiting to avoid pm2 categorizing this as a code error
                return setTimeout(() => {
                    console.info('-- exiting 1500ms after mongodb disconnect');
                    process.exit(1);
                }, 1500);
            }
        })

    }
}

export default new MongoConnectionService();