import { LambdaChainService, MongoConnectService } from '../Services'
import { errors } from '../../Pacakges';
import handlers from '../handlers';
import Repository from '../Repository'
import config from "../../config";

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
            'Facade -> getWebContent'
        )
    }
}

export default new Facade(); //Only need one