var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var router = express.Router();
var User = require('../models/user');
const saltRounds = 10;

router.get('/', function(req, res) {
  User.find({
    role: 'admin'
  }, function(err, docs) {
    if (docs.length) {
      res.send('Admin exists, setup complete.');
    } else {
      var admin = new User({
        name: 'Stuthi Vijayaraghavan',
        role: 'admin',
        email: 'stuthi@casanyla.com',
        password: 'admin'
      });
      bcrypt.hash(admin.password, saltRounds, function(err, hash) {
        admin.password = hash;
        admin.save(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
      });
    }
  });
});

module.exports = router;
