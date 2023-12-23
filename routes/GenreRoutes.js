const express = require('express');
const router = express.Router();

const { MongoClient } = require('mongodb');

const mongoDB_URI = "mongodb+srv://Gene:Admin@genedb.q7uhupi.mongodb.net/GameGenres?retryWrites=true&w=majority";

async function connectToMongoDB(){
    const client = new MongoClient(mongoDB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB database!');
        return client
    } catch(error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

//different routes:

router.get("/", async (req, res, next) => {
    const client = await connectToMongoDB();
    const database = client.db(); // Get the default database
    const collections = await database.listCollections().toArray();
      
    // Extract collection names from the result
    const collectionNames = collections.map(collection => collection.name);
  
    // Render the view with collection names
    res.render('Genres', { collectionNames });
});

router.get("/Games", (req, res, next) => {
    console.log("Games Page entered");
    res.render('Games');
});

router.get("/AddGenre", (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGenre');
});

router.get("/AddGame", (req, res, next) => {
    console.log("AddGames Page entered");
    res.render('AddGame');
});

module.exports = router;