import { errors } from '../../Pacakges'


export default (() => {

    const _tryParseJSON = (JSON_String) => {
        try{
            return JSON.parse(JSON_String)
        } catch(exception){
            throw new errors.ParseError(`ERROR : ALERT : Error parsing JSON data`)
        }
    }

    /**
     * A lambda that is called by API gateway MUST return
     *   "statusCode" : number
     *   "body" : JSON stringified Object
     *   "isBase64Encoded": boolean // if Binary return true
     *
     *   https://aws.amazon.com/premiumsupport/knowledge-center/malformed-502-api-gateway/
     */
    const _convertToAwsAPIConsumableStructure = (data) => {
        if(data.details){
            return {
                "statusCode": data.statusCode,
                "body": JSON.stringify(data.details),
                "isBase64Encoded": false
            }
        }
        return {
            "statusCode": data.statusCode,
            "body": JSON.stringify(data.response),
            "isBase64Encoded": false
        }
    }

    return {
        tryParseJSON : _tryParseJSON,
        convertToAwsAPIConsumableStructure: _convertToAwsAPIConsumableStructure
    }

})()