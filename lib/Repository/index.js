import { errors } from '../../Pacakges';
import utils from "util";

export default class Repository {

    constructor(dbService){
        console.log('--- intializting');
        this.dbService = dbService;
    }

    /**
     * Add a state node to the regionPath collection
     * @param node
     * @return {Promise<any>}
     */
    addStateNode(node){
        return new Promise((resolve, reject) => {
            this.dbService.db.collection('regionPath')
                .insert(node, (error, result) => {
                    if(error){
                       return reject(`Failed to insert document : ${utils.inspect(document)} : error : ${utils.inspect(error)}`);
                    }

                    resolve(result)
                })

        })
    }

    /**
     * Get a node to search through based on state
     * @param state
     * @return {Promise<any>}
     */
    getStateNode(state){
        return new Promise((resolve, reject) => {
            console.log(`---- INFO --- GEt state node from DB`)
            this.dbService.db.collection('regionPath')
                .find({'state': state})
                .toArray((error, result) => {
                    if(error){
                        return reject(`ERROR : ALERT : Could not query the database to find the state node : state : ${state} : exception : ${error}`);
                    }
                    resolve(result)
                })
        })
    }

    /**
     * A state node can be updated by supplying
     * - state : example 'TX'
     * - level : example : 'MARKET'
     * - paths : example :
     * [
        {
            "level":"MARKET",
            "displayName":"TX-Austin",
            "path": "/us/tx/austin/",
            "language":"en",
            "type":"app"
        }
      ]
     * @param state
     * @param level
     * @param paths
     */
    updateStateNode(query, collectionToUpdate, data){
        return new Promise((resolve, reject) => {
            this.dbService.db.collection('regionPath')
                .findOneAndUpdate(
                    query,
                    {
                        $set: {
                            [`${collectionToUpdate}.collections.$`] : data
                        }
                    },
                    null,
                    (error, result) => {
                        if(error){
                            return reject(`Could not update path from collection : state : ${state}, paths: ${utils.inspect(paths)}`)
                        }

                        resolve(result);
                    }
                )
        })
    }
}
