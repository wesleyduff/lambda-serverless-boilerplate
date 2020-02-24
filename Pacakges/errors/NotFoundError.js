import BaseError from './BaseError';
import CONSTANTS from '../CONSTANTS';

class NotFoundError extends BaseError {
    constructor(message, caller = null) {
        super(message, caller);
        this.name = CONSTANTS.ERROR_NOT_FOUND;
    }
}

export default NotFoundError;