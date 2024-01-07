const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

// Getting function to load database data and creating a collection
const { connectToMongoDB } = require('../dbHandlings/DB_Connect');
const { createCollection } = require('../dbHandlings/createCollection');

// Use middleware to parse the form data
router.use(bodyParser.urlencoded({ extended: true }));

// Load the add genre page
router.get("/AddGenre", (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGenre');
});

// Load the add Game page
router.get("/AddGame", async (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGame');
});

// Load a specific genre when it gets clicked on, then loading the games for that specific genre
router.get("/:collectionName/:documentId", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    const documentId = req.params.documentId;

    try {
        // Connect to the database and look for the specific collection
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);

        // Fetch a specific document by ID using ObjectId
        const document = await collection.findOne({ _id: new ObjectId(documentId) });

        res.render('SpecificGame', { document, collectionName });

        console.log(document);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Load a specific genre when it gets clicked on, then loading the games for that specific genre
router.get("/:collectionName", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    try {
        // Connect to the database and look for the specific collection
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);

        // Fetch a specific document by ID (you can use a different criteria)
        const document = await collection.find({}).toArray();

        // Close the MongoDB connection
        await client.close();

        // Render the view with the document content
        res.render('SpecificGenre', { document, collectionName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

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

router.post('/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName;

    const document = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    };

    try {
        // Connect to the database and look for the specific collection
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);

        // Insert the new game document
        await insertDocument(client, collection, document);

        // Redirect back to the specific genre page
        res.redirect(`/Genres/${collectionName}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
