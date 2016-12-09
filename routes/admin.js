var express = require('express');

var router = express.Router();
var User = require('../models/user');

router.use(function(req, res, next) {
  // Allow only admins to access following endpoints
  console.log(req.session);
  if (req.session.role == 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
});

router.get('/', function(req, res) {
  // Admin data needs to be sent over.
  res.send('Admin root endpoint');
});

router.post('/addUser', function(req, res) {});

router.delete('/deleteUser', function(req, res) {});

router.post('/addProject', function(req, res) {});

router.delete('/deleteProject', function(req, res) {});

router.post('/assignProject', function(req, res) {});

router.delete('/retractProject', function(req, res) {});

module.exports = router;
