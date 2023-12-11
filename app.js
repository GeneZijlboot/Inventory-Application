const express = require("express");
const app = express();

app.set('view engine', 'ejs');
const port = 3000;


//set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://Gene:<password>@genedb.q7uhupi.mongodb.net/Inventory_Application?retryWrites=true&w=majority";

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB)
}

app.get("/", (req, res, next) => {
    console.log("Home Page entered");
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});