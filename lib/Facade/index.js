import { SearchService } from '../Services'
import { errors } from '../../Pacakges';
import handlers from '../handlers';

class Facade {

    constructor(){

    }

    getHello(testError = null){
        console.log("--- Calling Hello in Facade");
        if(testError){
            throw new errors.BaseError('Error : Alert : testing error : Facade -> getHello')
        }

        return handlers.responseHandler(
            'getOne',
            (() => {
                return {name : 'Base example'}
            })(),
            {message: 'Basic example'},
            'Facade -> getWebContent'
        )
    }
}

export default new Facade(); //Only need one