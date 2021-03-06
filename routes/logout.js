var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    console.log(req.sessionID);
    console.log(req.cookies);
    next();
  } else {
    req.session.destroy();
    res.send('Error occurred');
  }
});

router.post('/', function(req, res) {
  res.clearCookie('email');
  res.clearCookie('name');
  res.clearCookie('session');
  res.clearCookie('connect.sid');
  req.session.destroy();
  res.send('Successfully logged out');
});

module.exports = router;
