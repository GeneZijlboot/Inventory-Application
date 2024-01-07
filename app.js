const express = require('express');
const app = express();

//setting up view enging
app.set('view engine', 'ejs');

const dotenv = require("dotenv"); // Add this line to require dotenv
// Load environment variables from a .env file
dotenv.config();

//setting port
const port = process.env.PORT || 3000;

const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

//getting function to load database data
const { connectToMongoDB } = require('./dbHandlings/DB_Connect');

// main two Routes
app.get("/", async (req, res, next) => {
    const client = await connectToMongoDB();
    const database = client.db('GameGenres');
    const collections = await database.listCollections().toArray();
    let totalDocumentCount = 0;
  
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = database.collection(collectionName);
  
      // Find all documents in the collection and count them
      const documentCount = await collection.countDocuments();
      totalDocumentCount += documentCount;
    }
  
    const collectionCount = collections.length;
    console.log('Amount of collections: ' + collectionCount);
    console.log('Total number of documents: ' + totalDocumentCount);
  
    console.log("Home Page entered");
    res.render('Home', { collectionCount, totalDocumentCount, BASE_URL: BASE_URL });
  });
  
app.get("/About", (req, res, next) => {
    console.log("About Page entered");
    res.render('About');
});

//configuring /Genre Routes
const genreRouter = require('./routes/GenreRoutes');
app.use('/Genres', genreRouter) ;

//run the server on port 3000
app.listen(port, async () => {
    try {
        console.log(`Server running on: ${port}`);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
});