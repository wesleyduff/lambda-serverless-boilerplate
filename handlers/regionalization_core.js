import "@babel/polyfill"

import Facade from '../lib/Facade';
import handlers from '../lib/handlers';
import Utilities from '../lib/Utilities';

import utils from 'util';

export const getStateNode = async event => {
    try{
        console.log(`DEBUGGING ---> --- Calling get Data : event : ${utils.inspect(event)}`)
        return Utilities.convertToAwsAPIConsumableStructure(await Facade.entry_database_getStateNode(event.pathParameters.state));
    } catch(exception){
        return Utilities.convertToAwsAPIConsumableStructure(handlers.exceptionHandlers(exception));
    }

};