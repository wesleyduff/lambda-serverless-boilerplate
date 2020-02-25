import BaseError from './BaseError';
import CONSTANTS from '../CONSTANTS';

class ParseError extends BaseError {
    constructor(message, caller = null) {
        super(message, caller);
        this.name = CONSTANTS.ERROR_PARSE;
    }
}

export default ParseError;