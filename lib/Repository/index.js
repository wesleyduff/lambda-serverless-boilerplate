import { errors } from '../../Pacakges';
import {MongoConnectService} from "../../lib/Services"
import utils from "util";

export default class Repository {

    constructor(){
        console.log('--- intializting');
        this.dbService = MongoConnectService;
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
                        console.log(`ERROR : ALERT : Could not query the database to find the state node : state : ${state} : exception : ${error}`)
                        return reject(`ERROR : ALERT : Could not query the database to find the state node : state : ${state} : exception : ${error}`);
                    }
                    console.log(` GOT : state node : state : ${state} : exception : ${error}`)
                    resolve(result)
                })
        })
    }

    /**
     * A state node can be updated by supplying
     * - query : example
     * {
         'state': 'TX',
         'stateCollection.collections.displayName': 'TX'
       }
     * - collection to update : example : 'stateCollection'
     * - data : example :
     * {
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
                            return reject(`Could not update path from collection : query : ${utils.inspect(query)}, collectionToUpdate: ${collectionToUpdate}, data: ${utils.inspect(data)}`)
                        }

                        resolve(result);
                    }
                )
        })
    }


    /**
     * Add an item to the collection that is part of the level collection
     * @param query
     * @param sort
     * @param doc
     * @param options
     * @return {Promise<document that was updated>}
     */
    async addCollectionToLevelCollection(query, collectionToAppendTo, collection, options = {returnOriginal: false}){

        return await this.dbService.db.collection('regionPath')
            .findOneAndUpdate(
                query,
                {
                    $addToSet: {
                        [`${collectionToAppendTo}.collections`] : collection
                    }
                },
                options)
    }


    /**
     * Delete a whole item from a level collections collection array
     * @param query
     * @param collectionToRemoveFrom
     * @param collectionSelectorQuery
     * @param options
     * @return {Promise<Collection~findAndModifyWriteOpResultObject>}
     */
    async deleteCollectionFromLevelCollectionCollections(query, levelCollectionToRemoveFrom, collectionSelectorQuery, options = {returnOriginal: false}){
        return await this.dbService.db.collection('regionPath')
            .findOneAndUpdate(
                query,
                {
                    $pull: {
                        [`${levelCollectionToRemoveFrom}.collections`] : collectionSelectorQuery
                    }
                },
                options)
    }

    /**
     * Remove a zip code from a collection
     * @param query
     * @param levelCollectionToUpadate
     * @param zipCodeToRemoveFromZipCodeArray
     * @param options
     * @return {Promise<Collection~findAndModifyWriteOpResultObject>}
     */
    async deleteZipCodeFromLevelCollectionCollections(query, levelCollectionToUpadate, zipCodeToRemoveFromZipCodeArray, options={returnOriginal: false}){
        return await this.dbService.db.collection('regionPath')
            .findOneAndUpdate(
                query,
                {
                    $pull: {
                        [`${levelCollectionToUpadate}.collections.$.zipCodes`] : zipCodeToRemoveFromZipCodeArray
                    }
                },
                options
            )
    }

    async addZipCodetoLevelCollectionCollections(query, levelCollectionToUpdate, zipCodeToAdd, options={returnOriginal: false}){
        return await this.dbService.db.collection('regionPath')
            .findOneAndUpdate(
                query,
                {
                    $push : {
                        [`${levelCollectionToUpdate}.collections.$.zipCodes`] : zipCodeToAdd
                    }
                },
                options
            )
    }



}
