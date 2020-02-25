import { errors } from '../../Pacakges';

export default class Repository {

    constructor(dbService){
        console.log('--- intializting');
        this.dbService = dbService;
    }

    getStateNode(state){
        return new Promise((resolve, reject) => {
            console.log(`---- INFO --- GEt state node from DB`)
            return this.dbService.db.collection('regionPath')
                .find({'ravenMetadata.state': state})
                .toArray((error, result) => {
                    if(error){
                        return reject(`ERROR : ALERT : Could not query the database to find the state node : state : ${state} : exception : ${error}`);
                    }
                    resolve(result)
                })
        })
    }
}
