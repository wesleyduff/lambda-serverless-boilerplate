import { LambdaChainService, MongoConnectService } from '../Services'
import {CONSTANTS, errors} from '../../Pacakges';
import handlers from '../handlers';
import Repository from '../Repository'
import config from "../../config";
import Utilities from '../Utilities';

class Facade {

    constructor(){
        this.Repository = null;
    }

    async _instantiateRepository(){
        console.log(`DEBUGGING---> Inside facade : instantiateRepository`)
        if(this.Repository){
            console.log(`DEBUGGING---> repository already made`)
            return this.Repository;
        }

        await MongoConnectService.connect(config);
        console.log(`DEBUGGING---> mongo connected`)

        this.Repository = new Repository();

        return this.Repository;
    }

    /**
     * This is the entry method called to get paths for languages and consumers (APP, WEB)
     * @return {Promise<*|{result, status}|{result, details, message, status}>}
     */
    async entry_database_getStateNode(state){
        console.log(`DEBUGGING---> Inside facade : entry_database_getStateNode`)
        const Repository = await this._instantiateRepository();

        return handlers.responseHandler(
            'getOne',
            await Repository.getStateNode(state),
            {message: `Getting state node from regionalization collection : state : ${state}`},
            'Facade -> entry_database_getStateNode'
        )
    }

    /**
     * This is the entry method called to get paths for languages and consumers (APP, WEB)
     * @return {Promise<*|{result, status}|{result, details, message, status}>}
     */
    async entry_getPathsViaSearch(searchTopic){
        console.log("--- Calling Hello in Facade");

        console.log('--- returing data')
        return handlers.responseHandler(
            'getOne',
            await LambdaChainService.chain('raven-ms-lambda-regionalization-dev-callToGetData'),
            {message: 'Basic example'},
            'Facade -> entry_getPathsViaSearch'
        )
    }


    /**
     * Add / Update state node
     * @param stateNode
     * @return {Promise<*|{response, status}|{response, details, message, status}>}
     */
    async entry_addUpdateStateNode(stateNode){
        console.log(`DEBUGGING ---> Adding state node`);
        console.log(`DEBUGGING---> Inside facade : entry_database_getStateNode`)
        const Repository = await this._instantiateRepository();
        return handlers.responseHandler(
            'addOne',
            await Repository.addUpdateStateNode({state: stateNode.state}, stateNode),
            {message: 'Adding / updating state node to database', stateNode},
            'Facade -> entry_addUpdateStateNode'
        )
    }


    /**
     * Add Update Delete zip code array
     * post body example
     * {
     *  "query": {
     *     "state": "NY",
     *     "levelCollection": "marketCollection",
     *     "displayName" : "NY-HomeTown"
     *  },
     *  "newZipCodeArray": [10000,10002]
     * }
     * @param postBody
     * @return {Promise<*|{response, status}|{response, details, message, status}>}
     */
    async entry_addUpdateDeleteZipCodeArray(postBody){
        const Repository = await this._instantiateRepository();
        console.log(`DEBUGGING ---> Adding / updating / deleting zip code array`);
        console.log(`DEBUGGING---> Inside facade : entry_addUpdateDeleteZipCodeArray`)
        const {query : {state, levelCollection, displayName}, newZipCodeArray } = postBody
        return handlers.responseHandler(
            'update',
            await Repository.updateZipCodeArrayForLevelCollectionCollectionsConsumer(
                {
                    'state': state,
                    [`${levelCollection}.collections.displayName`] : displayName
                },
                levelCollection,
                newZipCodeArray
            ),
            {message: 'Add / update / delete zip code array', postBody},
            'Facade -> entry_addUpdateDeleteZipCodeArray'
        )
    }
}

export default new Facade(); //Only need one