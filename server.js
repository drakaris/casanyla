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
  origin: 'casanyla.com'
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

app.options('*', cors());

app.use(function(req, res, next) {
  // var oneof = false;
  // res.header('Access-Control-Allow-Credentials', true);
  // if (req.headers.origin) { //req.headers.origin.match(/whateverDomainYouWantToWhitelist/g) ) {
  //   res.header('Access-Control-Allow-Origin', 'http://casanyla.com');
  //   oneof = true;
  // }
  // if (req.headers['access-control-request-method']) {
  //   res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
  //   oneof = true;
  // }
  // if (req.headers['access-control-request-headers']) {
  //   res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  //   oneof = true;
  // }
  // if (oneof) {
  //   res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  // }

  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  // intercept OPTIONS method
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/user', require('./routes/user'));
app.use('/project', require('./routes/project'));

// Start Server
app.listen(port, function() {
  console.log('Express running on port ' + port);
});
