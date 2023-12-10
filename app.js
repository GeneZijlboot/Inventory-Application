const express = require("express");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.get("/", (req, res, next) => {
    console.log("Home Page entered");
    res.render('index');
});

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});