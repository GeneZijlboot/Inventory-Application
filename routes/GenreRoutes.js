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

    // Here the code to save the form data to the database
    res.redirect('/Genres');
});

router.get("/AddGenre", (req, res, next) => {
    console.log("AddGenre Page entered");
    res.render('AddGenre');
});

router.get("/:collectionName", async (req, res, next) => {
    const collectionName = req.params.collectionName;

    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collectionData = await database.collection(collectionName).find({}).toArray();
        await client.close();

        // Render the view with data for the specific genre
        res.render('SpecificGenre', { collectionData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
