const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Use middleware to parse the form data
router.use(bodyParser.urlencoded({ extended: true }));

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

async function createCollection(database, genre){
    try {   
        await database.createCollection(genre);
        console.log(`Collection '${genre}' created successfully.`);
    } catch (error) {
        console.error(`Error creating new Genre '${genre}':`, error);
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

router.post('/', async (req, res) => {
    const genre = req.body.Genre.replace(/[^a-zA-Z0-9]/g, '_');

    console.log(genre);

    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        await createCollection(database, genre);
        await client.close();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }

    //here the code to save the form data to the database
    res.redirect('/Genres');
});

router.get("/AddGenre", (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGenre');
});

module.exports = router;