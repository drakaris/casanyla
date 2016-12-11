var express = require('express');

var router = express.Router();
var Style = require('../models/style');

/*********************
 * User level routes *
 ********************/
router.get('/', function(req, res) {
  // PARAMS : None
  if (req.query.active == 'false' && req.session.role == 'admin') {
    Style.find({}, function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    });
  } else {
    Style.find({
      'active': true
    }, function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    });
  }
});

/**********************
 * Admin level routes *
 *********************/
router.use(function(req, res, next) {
  // Allow only admins to access following endpoints
  if (req.session.role == 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
});

router.post('/', function(req, res) {
  // Creates a new style in DB
  // Refer associated model for params
  var newStyle = new Style(req.body);
  newStyle.save(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

router.put('/:styleId', function(req, res) {
  // Updates existing style in DB
  // PARAMS : MongoID as part of URL
  // PARAMS : Update object with new data
  Style.findOneAndUpdate({
    _id: req.params.styleId
  }, req.body, {
    upsert: false
  }, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });
});

router.delete('/:styleId', function(req, res) {
  // Deletes existing style in DB
  // PARAMS : MongoID as part of URL
  Style.find({
    _id: req.params.styleId
  }).remove().exec(function(err, removed) {
    if (err) {
      res.send(err);
    } else {
      res.send(removed);
    }
  });
});

module.exports = router;
