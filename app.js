const express = require('express');
const app = express();

//setting up view enging
app.set('view engine', 'ejs');

//setting port
const PORT = 3000;

//getting function to load database data
const { connectToMongoDB } = require('./dbHandlings/DB_Connect');

//main two Routes
app.get("/", async (req, res, next) => {
    const client = await connectToMongoDB();
    const database = client.db('GameGenres');
    const collections = await database.listCollections().toArray();
    const collectionCount = collections.length;
    console.log('amount of collections: ' + collectionCount);
    
    console.log("Home Page entered");
    res.render('Home', { collectionCount });
});

app.get("/About", (req, res, next) => {
    console.log("About Page entered");
    res.render('About');
});

//configuring /Genre Routes
const genreRouter = require('./routes/GenreRoutes');
app.use('/Genres', genreRouter) ;

//run the server on port 3000
app.listen(PORT, async () => {
    try {
        console.log(`Server running on: http://localhost:${PORT}`);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
});