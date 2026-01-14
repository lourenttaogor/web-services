const MongoClient = require('mongodb').MongoClient;

const initdb = (callback) => {
    // 1. Check if the URL is defined to avoid silent crashes
    if (!process.env.CONTACT_URL) {
        return callback(new Error("CONTACT_URL is not defined in environment variables"));
    }

    // 2. Connect using the URL
    MongoClient.connect(process.env.MONGO_URL)
        .then((client) => {
            console.log("Connected successfully to MongoDB");
            
            // 3. Extract the database instance (e.g., 'contacts_db')
            const db = client.db(); 

            // 4. Pass the database back via the callback
            callback(null, db);
        })
        .catch((err) => {
            // 5. Handle connection errors
            console.error("Connection failed:", err);
            callback(err);
        });
};


const getDatabase = () => {
    // Throw an error if someone tries to get the DB before it's initialized
    if (!_db) {
        throw new Error('Database not initialized. Call initdb first!');
    }
    return _db;
};

// Export both functions
module.exports = {
    initdb,
    getDatabase
};