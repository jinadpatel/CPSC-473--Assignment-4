var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/trivia');

// Create a movie schema
var triviaSchema = mongoose.Schema({
    question: String,
    answer: String,
});

// Create a database collection model
var trivia = mongoose.model('trivia', triviaSchema);

module.exports.trivia = trivia;