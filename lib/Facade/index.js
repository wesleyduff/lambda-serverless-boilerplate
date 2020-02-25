import { LambdaChainService } from '../Services'
import { errors } from '../../Pacakges';
import handlers from '../handlers';
import Repository from '../Repository'

class Facade {

    constructor(){
        this.Repository = null;
    }

    _instantiateRepository(){
        if(this.Repository){
            return this.Repository;
        }

        this.Repository = new Repository();

        return this.Repository;
    }

    /**
     * This is the entry method called to get paths for languages and consumers (APP, WEB)
     * @return {Promise<*|{result, status}|{result, details, message, status}>}
     */
    async entry_database_getStateNode(state){

        const Repository = this._instantiateRepository();

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