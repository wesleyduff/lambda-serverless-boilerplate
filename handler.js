import Facade from './lib/Facade';
import handlers from './lib/handlers';

export const hello = async event => {
    try{
        const response = await Facade.getHello('ts');
        return {
            statusCode: 200,
            body: response
        };
    } catch(exception){
        return handlers.exceptionHandlers(exception);
    }

};
