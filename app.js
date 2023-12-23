const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const PORT = 3000; 

//main two Routes
app.get("/", (req, res, next) => {
    console.log("Home Page entered");
    res.render('Home');
});

app.get("/About", (req, res, next) => {
    console.log("About Page entered");
    res.render('About');
});

//configuring /Genre Routes
const genreRouter = require('./routes/GenreRoutes');
app.use('/Genres', genreRouter) 

//run the server on port 3000
app.listen(PORT, async () => {
    try {
        console.log(`Server running on: http://localhost:${PORT}`);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
});