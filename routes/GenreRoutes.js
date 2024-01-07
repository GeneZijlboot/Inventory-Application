const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { ObjectId } = require('mongodb');
const { connectToMongoDB, insertDocument } = require('../dbHandlings/DB_Connect');
const { createCollection } = require('../dbHandlings/createCollection');
const { createDocument } = require('../dbHandlings/createDocument');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride('_method'));

router.get("/AddGenre", (req, res, next) => {
    res.render('AddGenre');
});

router.get("/AddGame/:collectionName", (req, res, next) => {
    const collectionName = req.params.collectionName;
    res.render('AddGame', { collectionName });
});

//Display Genre, Game, Game Detaile

router.get("/:collectionName/:documentId", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    const documentId = req.params.documentId;
    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);
        const document = await collection.findOne({ _id: new ObjectId(documentId) });
        res.render('SpecificGame', { document, collectionName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/:collectionName", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);
        const document = await collection.find({}).toArray();
        await client.close();
        res.render('SpecificGenre', { document, collectionName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/", async (req, res, next) => {
    try {
        const client = await connectToMongoDB();
        const database = client.db();
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        res.render('Genres', { collectionNames });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Creating Genre and Game

router.post('/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName;
    const document = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price
    };

    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);

        await createDocument(client, collection, document);

        // Redirect to the specific genre page after adding the game
        res.redirect(`/Genres/${collectionName}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    const genre = req.body.Genre.replace(/[^a-zA-Z0-9]/g, '_');
    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        await createCollection(database, genre);
        await client.close();
        res.redirect('/Genres');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

//Delete Genre and Game

router.delete("/:collectionName/:documentId", async (req, res, next) => {
    const collectionName = req.params.collectionName;
    const documentId = req.params.documentId;

    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');
        const collection = database.collection(collectionName);
        await collection.deleteOne({ _id: new ObjectId(documentId) });

        res.redirect(`/Genres/${collectionName}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.delete("/:collectionName", async (req, res, next) => {
    const collectionName = req.params.collectionName;

    try {
        const client = await connectToMongoDB();
        const database = client.db('GameGenres');

        await database.collection(collectionName).drop();

        res.redirect('/Genres');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;
