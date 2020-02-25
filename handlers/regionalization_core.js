import "@babel/polyfill"

import Facade from '../lib/Facade';
import handlers from '../lib/handlers';
import Utilities from '../lib/Utilities';

export const init = async event => {
    try{
        console.log('--- Calling get Data')
        return Utilities.convertToAwsAPIConsumableStructure(await Facade.entry_getPathsViaSearch(event.searchCriteria));
    } catch(exception){
        return Utilities.convertToAwsAPIConsumableStructure(handlers.exceptionHandlers(exception));
    }

};