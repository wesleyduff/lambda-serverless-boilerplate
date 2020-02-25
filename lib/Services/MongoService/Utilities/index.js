
class Utilities {

    static setExpiresAfterSeconds(db, collection, seconds){
        return db.collection(collection).createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 });
    }
}

module.exports = Utilities;