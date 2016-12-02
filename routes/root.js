var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Modular Routes !')
});

module.exports = router;
