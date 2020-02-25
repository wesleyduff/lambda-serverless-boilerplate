import { errors } from '../../Pacakges'


export default (() => {

    const _tryParseJSON = (JSON_String) => {
        try{
            return JSON.parse(JSON_String)
        } catch(exception){
            throw new errors.ParseError(`ERROR : ALERT : Error parsing JSON data`)
        }
    }

    return {
        tryParseJSON : _tryParseJSON
    }

})()