var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var Style = require('../models/style');

router.post('/', function(req, res) {
  // Returns quiz results
  var relatedStyles = [];
  var counts = {};
  var highestCount = 0;
  var result = [];
  req.body.forEach(function(obj) {
    // Iterate through answer choices
    obj.options.forEach(function(option) {
      // Check for answered choice
      if (option.answered) {
        // Update answer object
        relatedStyles = relatedStyles.concat(option.relatedStyles);
      }
    });
  });

  for (var i = 0; i < relatedStyles.length; i++) {
    var style = relatedStyles[i];
    counts[style] = counts[style] ? counts[style] + 1 : 1;
    if (counts[style] > highestCount) {
      highestCount = counts[style];
    }
  }

  Object.keys(counts).forEach(function(key) {
    if (counts[key] == highestCount) {
      result.push(mongoose.Types.ObjectId(key));
    }
  });

  Style.find({
    '_id': {
      $in: result
    }
  }, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.send(doc);
    }
  });
});

module.exports = router;
