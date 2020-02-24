class BaseError extends Error {
    constructor(message, caller=null) {
        super();
        this.message = message;
        this.name = "Error"; // (different names for different built-in error classes)
        this.caller = caller;
    }
}

export default BaseError;