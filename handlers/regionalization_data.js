import "@babel/polyfill"

import Facade from '../lib/Facade';
import handlers from '../lib/handlers';

export const init = async event => {
    try{
        return await Facade.fetchData();
    } catch(exception){
        return handlers.exceptionHandlers(exception);
    }

};