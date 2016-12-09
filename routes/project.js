var express = require('express');

var router = express.Router();
var User = require('../models/user');
var Project = require('../models/project');

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
  Project.find({})
    .populate('owner', '_id name')
    .populate('designer', '_id name')
    .populate('createdBy', '_id name')
    .exec(function(err, docs) {
      if (err) throw err;
      res.send(docs);
    });
});

router.get('/:projectId', function(req, res) {
  // Router returns specific user from DB
  Project.findOne({
      _id: req.params.projectId
    })
    .populate('owner', '_id name')
    .populate('designer', '_id name')
    .populate('createdBy', '_id name')
    .exec(function(err, docs) {
      if (err) throw err;
      res.send(docs);
    });
});

router.post('/', function(req, res) {
  // Router creates a project in DB
  User.findOne({
    _id: req.body.owner
  }, function(err, doc) {
    // Verify owner is client
    if (err) throw err;
    if (doc.role != 'client') {
      res.send('Owner is not a client');
      return;
    } else {
      User.findOne({
        _id: req.body.designer
      }, function(err, doc) {
        // Verify authenticity of designer
        if (err) throw err;
        if (doc.role != 'designer') {
          res.send('Specify valid designer');
          return;
        } else {
          // All fine, create project
          var data = req.body;
          data.createdBy = req.session.userId;
          var newProject = new Project(data);
          newProject.save(function(err, result) {
            if (err) throw err;
            res.send(result);
          });
        }
      });
    }
  });
});

router.put('/:projectId', function(req, res) {
  // Route modifies/updates a project in DB
  Project.findOneAndUpdate({
    _id: req.params.projectId
  }, req.body, {
    upsert: false
  }, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });
});

router.delete('/:projectId', function(req, res) {
  Project.find({
    _id: req.params.projectId
  }).remove().exec(function(err, removed) {
    if (err) throw err;
    res.send(removed);
  });
});

module.exports = router;
