/*{
    "node": true,
    "camelcase": true,
    "indent": 4,
    "undef": true,
    "quotmark": "single",
    "maxlen": 80,
    "trailing": true
    "curly": true,
    "eqeqeq": true,
    "forin": true,
    "immed": true,
    "latedef": true,
    "newcap": true,
    "nonew": true,
    "unused": true,
    "strict": true
}*/

var express = require('express'),
    http = require('http'),
    parser = require("body-parser"),
    triviaDB = require('./client/javascripts/app'),
    MongoClient = require('mongodb').MongoClient,
    redis = require('redis'),
    client = redis.createClient(),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectID,
    app;
app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/client');
app.set('view engine', 'html');
client.set("right", 0);
client.set("wrong", 0);
var jsonParser = parser.json({
    type: 'application/json'
});
var router = express.Router();
app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());
var url = 'mongodb://localhost:27017/trivia';
app.get('/question', function(req, res) {
    var searchQuestions = function(db, callback) {
        var data = db.collection('questionBanknew').find().toArray(function(err, documents) {
            res.json(documents);
            db.close();
        });
    };
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        searchQuestions(db, function() {});
    });
});
app.post('/question', function(req, res) {
    var question = req.body["question"];
    var answer = req.body["answer"];
    var insert = function(db, callback) {
        db.collection('questionBanknew').insert({
            "question": question,
            "answer": answer
        });
        var data = db.collection('questionBanknew').find().toArray(function(err, documents) {
            res.json(documents);
        });
    };
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insert(db, function() {
            db.close();
        });
    });
});
app.post('/answer', function(req, res) {
    var possible = req.body["possibleAns"];
    //console.log(possible);
    var id = req.body["answerId"];
    var actual = req.body["answer"];
    //console.log(actual);
    var correct;
    if (actual == possible) {
        client.incr("right", function(err, reply) {
            console.log("Right: " + reply);
        });
        var demo = {"correct":true};
        res.json(demo);
    }
    if (actual != possible) {
        client.incr("wrong", function(err, reply) {
            console.log("Wrong: " + reply);
        });
        var demo = {"correct":false}
        res.json(demo);
    }
});
app.get('/score', function(req, res) {
    var right;
    var wrong;
    client.get("right", function(err, reply) {
        right = reply;
        console.log("Right : " + right);
        client.get("wrong", function(err, reply) {
            wrong = reply;
            console.log("Wrong : " + wrong);
            res.json({
                "right": right,
                "wrong": wrong
            });
        });
    });
});
require('./client/javascripts/routes')(app);
app.listen(3000, function() {
    console.log('localhost:3000');
});