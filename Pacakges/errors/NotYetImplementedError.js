import BaseError from './BaseError';
import CONSTANTS from '../CONSTANTS';

class NotYetImplementedError extends BaseError {
    constructor(message, caller = null) {
        super(message, caller);
        this.name = CONSTANTS.ERROR_DATABASE;
    }
}

export default NotYetImplementedError;