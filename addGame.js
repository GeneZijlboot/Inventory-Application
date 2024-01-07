const mongoose = require('mongoose');

const newGameSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String
})

module.exports = mongoose.model("newGame", newGameSchema);