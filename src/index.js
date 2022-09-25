const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Bhuwan:fake2fake@cluster0.m4domip.mongodb.net/Project-2?retryWrites=true&w=majority", {useNewUrlParser: true
})
    .then(() => console.log('mongodb is Connected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});