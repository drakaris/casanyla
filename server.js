/**********************
 * Essential Includes *
 *********************/
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);

/*******************
 * Mongo variables *
 ******************/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/casanyla');
var db = mongoose.connection;
var store = new mongoStore({
  mongooseConnection: mongoose.connection
});

/*********************
 * Setting Variables *
 ********************/
var app = express();
var port = process.env.PORT || 3000;

/******************
 * CORS Variables *
 *****************/
var corsOptions = {
  origin: /casanyla\.com|localhost/,
  credentials: true
};

/**********************
 * Application Config *
 *********************/
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  cookie: {
    path: '/',
    httpOnly: false,
    maxAge: null
  },
  secret: 'casanyla@123',
  saveUninitialized: true,
  resave: false,
  store: store,
  ttl: 9999
}));

/******************
 * Event Handlers *
 *****************/
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Established connection to MongoDB');
});
store.on('set', function(id) {
  console.log('Session created: ' + id);
});
store.on('destroy', function(id) {
  console.log('Session destroyed: ' + id);
});

/*****************
 * Server Routes *
 ****************/
app.use('/', require('./routes/root'));
app.use('/setup', require('./routes/setup'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/user', require('./routes/user'));
app.use('/project', require('./routes/project'));
app.use('/style', require('./routes/style'));
app.use('/question', require('./routes/question'));
app.use('/quiz', require('./routes/quiz'));

// Start Server
app.listen(port, function() {
  console.log('Express running on port ' + port);
});
