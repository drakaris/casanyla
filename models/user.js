var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: {
    type: String,
    index: true
  },
  password: String
}, {
  timestamps: true
});

var User = mongoose.model('User', userSchema);
module.exports = User;
