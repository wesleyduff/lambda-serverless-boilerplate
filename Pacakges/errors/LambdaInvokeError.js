import BaseError from './BaseError';
import CONSTANTS from '../CONSTANTS';

class LambdaInvokeError extends BaseError {
    constructor(message, caller = null) {
        super(message, caller);
        this.name = CONSTANTS.ERROR_LAMBDA_INVOKE;
    }
}

export default LambdaInvokeError;