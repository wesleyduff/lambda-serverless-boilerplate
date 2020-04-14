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
    async entry_getEvents(params){
        if(!params
        || params && !params.calendarEvent){
            throw new errors.NotFoundError(`Error : Alert : The calendar event is not provided`, 'Facade -> entry_getEvents')
        }
        console.log(`DEBUGGING---> Inside facade : entry_database_getStateNode`)
        const Repository = await this._instantiateRepository();

        return handlers.responseHandler(
            'getOne',
            await Repository.getCalendarEvents(params.calendarEvent),
            {message: `Getting calendar event for  : ${params.calendarEvent}`},
            'Facade -> entry_getEvents'
        )
    }
}

export default new Facade(); //Only need one