var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var User = require('../models/user');
const saltRounds = 10;

/*********************
 * User level routes *
 ********************/
router.get('/', function(req, res) {
  // Route returns current user information
  User.findOne({
    _id: req.session.userId
  }, function(err, doc) {
    if (err) {
      res.send(err);
      // res.sendStatus(500);
    } else {
      res.send(doc);
    }
  });
});

router.put('/', function(req, res) {
  // Route modifies/updates a user in DB
  User.findOneAndUpdate({
    _id: req.session.userId
  }, req.body, {
    upsert: false
  }, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });
});

/**********************
 * Admin level routes *
 *********************/
router.use(function(req, res, next) {
  // Allow only admins to access following endpoints
  console.log(req.session);
  if (req.session.role == 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
});

router.get('/list', function(req, res) {
  // Route returns all users in DB
  User.find({}, function(err, docs) {
    if (err) throw err;
    res.send(docs);
  });
});

router.get('/:userId', function(req, res) {
  // Router returns specific user from DB
  User.findOne({
    _id: req.params.userId
  }, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });
});

router.post('/', function(req, res) {
  // Route creates a new user in DB
  User.find({
    email: req.body.email
  }, function(err, docs) {
    if (err) throw err;
    if (docs.length) {
      res.send('User exists, creation not possible.');
    } else {
      var newUser = new User(req.body);
      bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        newUser.password = hash;
        newUser.save(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
      });
    }
  });
});

router.put('/:userId', function(req, res) {
  // Route modifies/updates a user in DB

  User.findOneAndUpdate({
    _id: req.params.userId
  }, req.body, {
    upsert: false
  }, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });
});

router.delete('/:userId', function(req, res) {
  User.find({
    _id: req.params.userId
  }).remove().exec(function(err, removed) {
    if (err) throw err;
    res.send(removed);
  });
});

module.exports = router;
