import { errors } from '../../Pacakges';
import CONSTANTS from '../../Pacakges/CONSTANTS';

import utils from 'util';

/**
 * A lambda that is called by API gateway MUST return
 *   "statusCode" : number
 *   "body" : JSON stringified Object
 *   "isBase64Encoded": boolean // if Binary return true
 *
 *   https://aws.amazon.com/premiumsupport/knowledge-center/malformed-502-api-gateway/
 */

export default {
    responseHandler: (type, response, details, path) => {
        switch(type){
            case 'getOne':
                if(response) return {
                    "statusCode": 200,
                    "body": JSON.stringify(response),
                    "isBase64Encoded": false
                }
                throw new errors.NotFoundError(
                    `Could not find ${details}`,
                    path
                );
            case 'upsertOne':
                if(response.result.ok === 1 && response.result.n === 1) {
                    return {
                        "statusCode": 202,
                        "body": JSON.stringify(response.result),
                        "isBase64Encoded": false
                    };
                }
                throw new errors.DatabaseError(`Failed to upsert mobile : ${JSON.stringify(details)} `, path )
            default:
                return null;
        }
    },
    exceptionHandlers: exception => {
        if(!exception.name){
            return {
                "statusCode": 500,
                "body": JSON.stringify({
                    errorCode: 'LAMBDA_001',
                    reason: 'Name is not provided in exception. Error was thrown without a custom error',
                    error: exception
                }),
                "isBase64Encoded": false
            }
        }
        switch (exception.name) {
            case CONSTANTS.ERROR_PARSE:
                return {
                    "statusCode": 502,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_002',
                        reason: 'Could not parse XML data from thrid party service',
                        message: exception.message ? exception.message : 'Could not parse data from third party'
                    }),
                    "isBase64Encoded": false
                }
            case CONSTANTS.ERROR_REQUEST:
                return {
                    "statusCode": 502,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_003',
                        reason: 'A third party call using the request library has failed and returned an error',
                        message: exception.message ? exception.message : 'The 3rd party call failed to perform the reqeust'
                    }),
                    "isBase64Encoded": false
                }
            case CONSTANTS.ERROR_DATABASE:
                return {
                    "statusCode": 500,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_004',
                        reason: 'The database failed to perform the task applied',
                        message: exception.message ? exception.message : 'The database failed to perform the task applied'
                    }),
                    "isBase64Encoded": false
                }
            case CONSTANTS.ERROR_BAD_DATA:
                return {
                    "statusCode": 422,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_005',
                        reason: 'Your request was malformed',
                        message: exception.message ? exception.message : 'The payload provided to the service is incorrect.'
                    }),
                    "isBase64Encoded": false
                };
            case CONSTANTS.ERROR_PARSE:
                return {
                    "statusCode": 400,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_006',
                        reason: 'Your request was malformed : Could not parse data',
                        message: exception.message ? exception.message : 'The payload provided to the service is incorrect.'
                    }),
                    "isBase64Encoded": false
                };
            case CONSTANTS.ERROR_OBJECT_ID_CREATION:
                return {
                    "statusCode": 422,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_007',
                        reason: 'Failed to convert provided ID into a type of ObjectID',
                        message: exception.message ? exception.message : 'Could not convert provided ID into ObjectID'
                    }),
                    "isBase64Encoded": false
                };
            case CONSTANTS.ERROR_INCORRECT_PARAMETERS:
                return {
                    "statusCode": 422,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_008',
                        reason: 'Missing mandatory field',
                        message: exception.message ? exception.message : 'Provided parameters did not meet minimum required parameters'
                    }),
                    "isBase64Encoded": false
                };
            case CONSTANTS.ERROR_NOT_FOUND:
                return {
                    "statusCode": 404,
                    "body": JSON.stringify({
                        errorCode: 'LAMBDA_009',
                        reason: 'Not found',
                        message: exception.message ? exception.message : 'Not found'
                    }),
                    "isBase64Encoded": false
                };

        }

        // Express Errors
        if(exception instanceof SyntaxError) {
            return {
                "statusCode": 400,
                "body": JSON.stringify({
                    errorCode: 'LAMBDA_010',
                    reason: 'Invalid Body',
                    message: exception.message || 'Invalid Body',
                }),
                "isBase64Encoded": false
            };
        }

        // Catch all
        return {
            "statusCode": 500,
            "body": JSON.stringify({
                errorCode: 'LAMBDA_011',
                reason: `Failed to return : ${utils.inspect(exception)}`,
                message: exception.message ? exception.message : 'Failed to return'
            }),
            "isBase64Encoded": false
        };


    }
}