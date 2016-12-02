/**********************
 * Essential Includes *
 *********************/
var express = require('express');
var morgan = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/*******************
 * Mongo variables *
 ******************/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/casanyla');
var db = mongoose.connection;

/*********************
 * Setting Variables *
 ********************/
var app = express();
var port = process.env.PORT || 3000;

/**********************
 * Application Config *
 *********************/
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/******************
 * Event Handlers *
 *****************/
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Established connection to MongoDB');
});

/*****************
 * Server Routes *
 ****************/
app.use('/', require('./routes/root'));
app.use('/setup', require('./routes/setup'));

// Start Server
app.listen(port, function() {
  console.log('Express running on port ' + port);
});
