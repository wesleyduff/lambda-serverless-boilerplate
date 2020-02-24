import { LambdaChainService } from '../Services'
import { errors } from '../../Pacakges';
import handlers from '../handlers';

class Facade {

    constructor(){

    }

    async fetchData(){
        return handlers.responseHandler(
            'getOne',
            (() => {
                return {
                    message: 'Fake data from fetch and calling regionalization_data.js lambda'
                }
            })(),
            {message: 'Basic example'},
            'Facade -> fetchData'
        )
    }

    async getData(testError = null){
        console.log("--- Calling Hello in Facade");
        if(testError){
            throw new errors.BaseError('Error : Alert : testing error : Facade -> getHello')
        }
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