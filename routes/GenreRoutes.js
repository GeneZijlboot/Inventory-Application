const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// Getting function to load database data and creating a collection
const { connectToMongoDB } = require('../dbHandlings/DB_Connect');
const { createCollection } = require('../dbHandlings/createCollection');

// Use middleware to parse the form data
router.use(bodyParser.urlencoded({ extended: true }));

// Different routes:
router.get("/", async (req, res, next) => {
    const client = await connectToMongoDB();
    const database = client.db(); // Get the default database
    const collections = await database.listCollections().toArray();

    // Extract collection names from the result
    const collectionNames = collections.map(collection => collection.name);

    // Render the view with collection names
    res.render('Genres', { collectionNames });
});

//a post request --> to make a genre and push it to the mongodb database
router.post('/', async (req, res) => {
    const genre = req.body.Genre.replace(/[^a-zA-Z0-9]/g, '_');

    const client = await connectToMongoDB();
    const database = client.db('GameGenres');
    await createCollection(database, genre);
    await client.close();

    // Here the code to save the form data to the database
    res.redirect('/Genres');
});

//load the add genre page
router.get("/AddGenre", (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGenre');
});

//load the add Game page
router.get("/AddGame", (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGame');
});

//load a specific genre when it gets clicked on, then loading the games for that specific genre
router.get("/:collectionName", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    try{
        //connect to database, and look for db --> specific collection
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);
        console.log(collection)

        // Fetch a specific document by ID (you can use a different criteria)
        const document = await collection.find({}).toArray();

        // Close the MongoDB connection
        await client.close();

        // Render the view with the document content
        res.render('SpecificGenre', { document , collectionName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/:collectionName/:documents_id", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    const documents_id = req.params.documents_id;

    // Connect to the MongoDB database
    const client = await connectToMongoDB();
    const database = client.db('GameGenres');
    const collection = database.collection(collectionName);

    // Fetch a specific document by ID
    const document = await collection.findOne({ _id: documents_id });

    // Close the MongoDB connection
    await client.close();

    // Render the view with the document content
    res.render('SpecificGame', { document , collectionName });
});

module.exports = router;
