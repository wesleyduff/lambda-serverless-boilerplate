import "@babel/polyfill"

import Facade from '../lib/Facade';
import handlers from '../lib/handlers';

export const init = async event => {
    try{
        console.log('--- Calling get Data')
        return await Facade.getData();
    } catch(exception){
        return handlers.exceptionHandlers(exception);
    }

};