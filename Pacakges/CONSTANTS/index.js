export default {
    BOTTOM_LINE: 'Bottom Line',
    ID: 'ID',
    ZONEID: 'zoneID',
    STATIONID: 'stationID',
    TRANSFORM: 'transform',
    LOCATION_ENUM: {
        LAT_LONG: 'LAT_LONG',
        ZIPCODE: 'ZIPCODE'
    },
    ERROR_MESSAGES : {
        WSI_DOWN_NO_DOCUMENT: 'Wsi is down, no document found in databse. Empty Object provided in kind.',
        NO_CLIENT_ID: 'No client ID was found to make request to WSI',
        NO_DEFAULT_ZIP_CODE:'No default zipcode was found for zoneID',
        NO_DEFAULT_ZIP_OR_CLIENT_ID:"No client ID or default Zip Code for ZoneID",
        API_CLIENT_ID_EXCEPTION: 'ERROR : ALERT : BAD_CLIENT_ID : clientID provided is not a valid clientID',
        JSON_PARSE_EXCEPTION: 'ERROR : ALERT : JSON PARSE EXCEPTION : Could not parse the JSON data provided',
        REQUEST_ERROR: 'ERROR : ALERT : REQUEST EXCEPTION : The request came back with an error'
    },
    SOURCE_ENUM: {
        DB_EXPIRED_DATA: 'DB_EXPIRED_DATA',
        DB_CACHED_DATA:'DB_CACHED_DATA',
        DB_NEW: 'DB_NEW',
        API_NEW: 'NEW_API_DATA',
        API_NEW_DB_EXPIRED:'API_NEW_DB_EXPIRED',
        BYPASS_FOR_QA : 'QA_HEADER_SET_TO_TRUE__NO_CALL_TO_WSI_DB_DATA_ONLY'
    },
    CONSUMER_ENUM : { //order should match TREE_ENUM order
        NEIGHBORHOOD: 'NEIGHBORHOOD',
        MARKET: 'MARKET',
        STATE: 'STATE',
        NATIONAL: 'NATIONAL'
    },
    TREE_ENUM: { //order matters and should match CONSUMER_ENUM
        LEVEL_1: 'LEVEL_1', //level 1 is most granular
        LEVEL_2: 'LEVEL_2',
        LEVEL_3: 'LEVEL_3',
        LEVEL_4: 'LEVEL_4', //level 4 or higher is less granular
    },
    SUPPORTED_LANGUAGES_ENUM: {
        EN_US_APP: 'EN_US_APP',
        SP_APP: 'SP_APP',
        EN_US_WEB: 'EN_US_WEB',
        SP_WEB: 'SP_WEB'
    },
    ERROR_INCORRECT_PARAMETERS: 'incorrectParametersError',
    ERROR_OBJECT_ID_CREATION: 'objectIDCreationError',
    ERROR_INVALID_TYPE:'invalidTypeError',
    ERROR_DATABASE: 'databaseError',
    ERROR_CONDITIONS_NOT_MET: 'conditionsNotMetError',
    ERROR_BASE_ERROR: 'baseError',
    ERROR_REQUEST: 'requestError',
    ERROR_PARSE: 'parseError',
    ERROR_PROTECT_AND_CHECK: 'protectAndCheckError',
    ERROR_NOT_FOUND: 'notFoundError',
    ERROR_BAD_DATA: 'badDataError',
    ERROR_LAMBDA_INVOKE: 'lambdaEnvokeError',
    ERROR_NOT_YET_IMPLEMENTED: 'notYetImplementedError'
}
