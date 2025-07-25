const {MongoClient} = require('mongodb');

class MongoDB {
    static client;

    static async connect(url) {
        if (MongoDB.client) {
            return MongoDB.client;
        }
        MongoDB.client = await MongoClient.connect(url);
        return MongoDB.client;
        

    }
    
}

module.exports = MongoDB;