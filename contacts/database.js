const { MongoClient } = require('mongodb');
require('dotenv').config();

let _db = null;
let _client = null;

function cleanConnectionString(uri) {
    // Don't use URL class - it doesn't work with mongodb+srv://
    // Just ensure tls and ssl are present
    let cleanedUri = uri;

    // Check if tls is already there
    const hasTls = cleanedUri.includes('tls=true');
    const hasSsl = cleanedUri.includes('ssl=true');

    if (!hasTls || !hasSsl) {
        // Add missing parameters
        const separator = cleanedUri.includes('?') ? '&' : '?';
        if (!hasTls) cleanedUri += `${separator}tls=true`;
        if (!hasSsl) cleanedUri += '&ssl=true';
    }

    return cleanedUri;
}

async function initdb(callback) {
    try {
        const uri = process.env.MONGO_URL;
        const dbName = process.env.MONGO_DB_NAME;

        if (!uri || !dbName) {
            throw new Error('Missing MONGO_URL or MONGO_DB_NAME environment variables');
        }

        const cleanedUri = cleanConnectionString(uri);

        console.log('Connecting to MongoDB...');
        _client = new MongoClient(cleanedUri);

        await _client.connect();
        _db = _client.db(dbName);

        console.log('✅ Connected to MongoDB successfully');
        callback(null, _db);
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        callback(err, null);
    }
}

function getDatabase() {
    return _db;
}

async function closeDatabaseConnection() {
    if (_client) {
        await _client.close();
        _db = null;
        _client = null;
        console.log('Database connection closed');
    }
}

module.exports = {
    initdb,
    getDatabase,
    closeDatabaseConnection
};
