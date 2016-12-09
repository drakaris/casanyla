var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    index: true,
    required: true
  },
  email: {
    type: String,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  delete obj.createdAt;
  delete obj.__v;
  return obj;
};

var User = mongoose.model('User', userSchema);
module.exports = User;
