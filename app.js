const express = require("express");
const app = express();

app.set('view engine', 'ejs');
const port = 3000;


//set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://Gene:Admin@genedb.q7uhupi.mongodb.net/Inventory_Application?retryWrites=true&w=majority";

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB)
    console.log("connected");

    // Assuming you have a model named 'Item' for your collection
    const Birds = mongoose.model('Birds', { name: String });

    // Example: Log all items in the 'items' collection
    const birds = await Birds.find({});
    console.log("Items in the database:", Birds);
}

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

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});