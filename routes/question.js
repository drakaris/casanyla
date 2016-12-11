var express = require('express');

var router = express.Router();
var Question = require('../models/question');

/*********************
 * User level routes *
 ********************/
router.get('/', function(req, res) {
  // Returns all questions
  // PARAMS : /question?active=false [OPTIONAL] --> toggle disabled questions
  if (req.query.active == 'false' && req.session.role == 'admin') {
    Question.find({}, function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    });
  } else {
    Question.find({
      'active': true
    }, function(err, docs) {
      if (err) {
        res.send(err);
      } else {
        res.send(docs);
      }
    });
  }
  // Question.find({})
  //   .populate('options.relatedStyles', '_id name')
  //   .exec(function(err, docs) {
  //     if (err) {
  //       res.send(err)
  //     } else {
  //       res.send(docs);
  //     }
  //   });
});

/*********************
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
  // Creates a new question in DB
  // PARAMS : Refer associated model
  var newQuestion = new Question(req.body);
  newQuestion.save(function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

router.put('/:questionId', function(req, res) {
  // Updates existing style in DB
  // PARAMS : MongoID as part of URL
  // PARAMS : Update object with new data
  Question.findOneAndUpdate({
    _id: req.params.questionId
  }, req.body, {
    upsert: false
  }, function(err, doc) {
    if (err) throw err;
    res.send(doc);
  });
});

router.delete('/:questionId', function(req, res) {
  // Deletes existing style in DB
  // PARAMS : MongoID as part of URL
  Question.find({
    _id: req.params.questionId
  }).remove().exec(function(err, removed) {
    if (err) {
      res.send(err);
    } else {
      res.send(removed);
    }
  });
});

module.exports = router;
