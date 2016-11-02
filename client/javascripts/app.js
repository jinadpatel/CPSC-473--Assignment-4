var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/trivia');

var triviaSchema = mongoose.Schema({
    question: String,
    answer: String,
});

// database collection model created
var trivia = mongoose.model('trivia', triviaSchema);

module.exports.trivia = trivia;