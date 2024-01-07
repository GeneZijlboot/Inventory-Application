const { MongoClient } = require('mongodb');

const mongoDB_URI = "mongodb+srv://Gene:Admin@genedb.q7uhupi.mongodb.net/GameGenres?retryWrites=true&w=majority";

async function connectToMongoDB() {
    const client = new MongoClient(mongoDB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB database!');
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connectToMongoDB };
