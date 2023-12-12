const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;

const mongoDB_URI = "mongodb+srv://Gene:Admin@genedb.q7uhupi.mongodb.net/GameGenres?retryWrites=true&w=majority";

//async function to connect to db

async function connectToMongoDB(){
    const client = new MongoClient(mongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB database!');
        return client
    } catch(error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

//paths --> place them in routes folder soon!

app.get("/", (req, res, next) => {
    console.log("Home Page entered");
    res.render('Home');
});

app.get("/About", (req, res, next) => {
    console.log("About Page entered");
    res.render('About');
});

app.get("/Genres", (req, res, next) => {
    console.log("Genres Page entered");
    res.render('Genres');
});

app.get("/Games", (req, res, next) => {
    console.log("Games Page entered");
    res.render('Games');
});

//run the server on port 3000

app.listen(PORT, async () => {
    try {
        console.log(`Server running on: http://localhost:${PORT}`);
        const client = await connectToMongoDB();
    } catch(error){
        console.log(error);
        process.exit(1);
    }
});