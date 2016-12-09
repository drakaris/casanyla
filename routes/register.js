var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var User = require('../models/user');
const saltRounds = 10;

router.post('/', function(req, res) {
  User.find({
    email: req.body.email
  }, function(err, docs) {
    if (docs.length) {
      res.send('User exists.');
    } else {
      var user = new User(req.body);
      bcrypt.hash(user.password, saltRounds, function(err, hash) {
        user.password = hash;
        user.save(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
      });
    }
  });
});

module.exports = router;
