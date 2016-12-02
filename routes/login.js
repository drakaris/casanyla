var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var User = require('../models/user');

router.use(function(req, res, next) {
  if (req.cookies['connect.sid']) {
    console.log('Existing Session: ' + req.session.id);
    console.log(req.session);
    res.send('Already logged in');
  } else {
    next();
  }
});

router.post('/', function(req, res) {
  User.findOne({
    email: req.body.email
  }, function(err, docs) {
    if (!docs) {
      res.send('Invalid email');
    } else {
      bcrypt.compare(req.body.password, docs.password, function(err, result) {
        if (err) throw err;
        if (result == true) {
          req.session.name = docs.name;
          req.session.email = docs.email;
          req.session.role = docs.role;
          req.session.maxAge = 9999;
          console.log(req.session);
          // res.cookie('email', docs.email);
          // res.cookie('name', docs.name);
          res.send('Success');
        } else {
          res.send('Invalid combination');
        }
      });
    }
  });
});

module.exports = router;
