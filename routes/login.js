var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var User = require('../models/user');

router.use(function(req, res, next) {
  if (req.session.userId) {
    console.log('Existing Session: ' + req.session.id);
    console.log(req.session);
    res.send('Already logged in');
  } else {
    if (req.body.email && req.body.password) {
      next();
    } else {
      res.send('Insufficient data');
    }
  }
});

router.post('/', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, doc) {
    if (!doc) {
      res.send('Invalid email');
    } else {
      bcrypt.compare(req.body.password, doc.password, function(err, result) {
        if (err) throw err;
        if (result == true) {
          req.session.name = doc.name; // Only for dev
          req.session.role = doc.role;
          req.session.userId = doc._id;
          req.session.maxAge = 9999;
          console.log(req.session);
          // res.cookie('email', doc.email);
          // res.cookie('name', doc.name);
          res.send(doc);
        } else {
          req.session.destroy();
          res.send('Invalid combination');
        }
      });
    }
  });
});

module.exports = router;
