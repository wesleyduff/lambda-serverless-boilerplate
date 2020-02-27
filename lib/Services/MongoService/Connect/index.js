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
        return new Promise((resolve, reject) => {
            try{
                if((this.client && !this.client.isConnected()) || (this.client === null)){
                    console.log('CONNECTING --------------------');

                    // this.client = await MongoClient.connect(
                    //     config.env === 'test'
                    //         ? await this.memoryServer.getConnectionString()
                    //         : config.mongo.url,
                    //     config.mongo.options
                    // );

                    const client = new MongoClient(config.mongo.url, { useNewUrlParser: true });
                    client.connect(err => {
                        if(err){
                            console.log(`DEBUGGING ---> ERROR : mongo error : ${utils.inspect(err)}`)
                            reject(err)
                        }
                        client.db("test").collection("devices");

                        console.log('Connected Client ----------------')
                        this.db = client.db("RavenData")
                        // perform actions on the collection object
                        this.client = client
                        resolve(this.db)
                    });
                } else if(this.client && this.client.isConnected()) {
                    console.log('Client allready connected - re-using connection');
                }
                console.log('CONNECTED____');
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
        })

    }
}

export default new MongoConnectionService();