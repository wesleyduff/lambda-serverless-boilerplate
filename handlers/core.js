import "@babel/polyfill"

import Facade from '../lib/Facade';
import handlers from '../lib/handlers';
import Utilities from '../lib/Utilities';

import utils from 'util';

export const getEvents = async event => {
    try{
        console.log(`Event -> ${utils.inspect(event)}`)
        console.log(`DEBUGGING ---> --- Calling getEvents : event : ${utils.inspect(event)}`)
        return Utilities.convertToAwsAPIConsumableStructure(await Facade.entry_getEvents(event.pathParameters));
    } catch(exception){
        return Utilities.convertToAwsAPIConsumableStructure(handlers.exceptionHandlers(exception));
    }
};