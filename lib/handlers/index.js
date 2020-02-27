import { errors } from '../../Pacakges';
import CONSTANTS from '../../Pacakges/CONSTANTS';

import utils from 'util';

export default {
    responseHandler: (type, response, details, path) => {
        switch(type){
            case 'getOne':
                console.log(`DEBUGGING : Returning get one in handler : ${utils.inspect(response)}`)
                if(response) return {
                    status: 200,
                    response
                }
                throw new errors.NotFoundError(
                    `Could not find ${details}`,
                    path
                );
            case 'upsertOne':
                if(response.result.ok === 1 && response.result.n === 1) {
                    return {
                        status: 202,
                        message: `Item was upserted`,
                        response: response.result,
                        details,
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
                status: 500,
                details: {
                    errorCode: 'LAMBDA_001',
                    reason: 'Name is not provided in exception. Error was thrown without a custom error',
                    error: exception
                }
            }
        }
        switch (exception.name) {
            case CONSTANTS.ERROR_PARSE:
                return {
                    status: 502,
                    details: {
                        errorCode: 'RMS005',
                        reason: 'Could not parse XML data from thrid party service',
                        message: exception.message ? exception.message : 'Could not parse data from third party'
                    }
                }
            case CONSTANTS.ERROR_REQUEST:
                return {
                    status: 502,
                    details: {
                        errorCode: 'RMS005',
                        reason: 'A third party call using the request library has failed and returned an error',
                        message: exception.message ? exception.message : 'The 3rd party call failed to perform the reqeust'
                    }
                }
            case CONSTANTS.ERROR_DATABASE:
                return {
                    status: 500,
                    details: {
                        errorCode: 'RMS004',
                        reason: 'The database failed to perform the task applied',
                        message: exception.message ? exception.message : 'The database failed to perform the task applied'
                    }
                }
            case CONSTANTS.ERROR_BAD_DATA:
                return {
                    status: 422,
                    details: {
                        errorCode: 'RMS001',
                        reason: 'Your request was malformed',
                        message: exception.message ? exception.message : 'The payload provided to the service is incorrect.'
                    }
                };
            case CONSTANTS.ERROR_BAD_DATA:
                return {
                    status: 400,
                    details: {
                        errorCode: 'RMS001',
                        reason: 'Your request was malformed',
                        message: exception.message ? exception.message : 'The payload provided to the service is incorrect.'
                    }
                };
            case CONSTANTS.ERROR_OBJECT_ID_CREATION:
                return {
                    status: 422,
                    details: {
                        errorCode: 'RMS002',
                        reason: 'Failed to convert provided ID into a type of ObjectID',
                        message: exception.message ? exception.message : 'Could not convert provided ID into ObjectID'
                    }
                };
            case CONSTANTS.ERROR_INCORRECT_PARAMETERS:
                return {
                    status: 422,
                    details: {
                        errorCode: 'RMS003',
                        reason: 'Missing mandatory field',
                        message: exception.message ? exception.message : 'Provided parameters did not meet minimum required parameters'
                    }
                };
            case CONSTANTS.ERROR_NOT_FOUND:
                return {
                    status:404,
                    details: {
                        errorCode: 'RMS004',
                        reason: 'Not found',
                        message: exception.message ? exception.message : 'Not found'
                    }
                };

        }

        // Express Errors
        if(exception instanceof SyntaxError) {
            return {
                status: 400,
                details: {
                    errorCode: 'RMS006',
                    reason: 'Invalid Body',
                    message: exception.message || 'Invalid Body',
                }
            };
        }

        // Catch all
        return {
            status: 500,
            details: {
                errorCode: 'RMS000',
                reason: `Failed to return : ${utils.inspect(exception)}`,
                message: exception.message ? exception.message : 'Failed to return'
            }
        };

    }
}