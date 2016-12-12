var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  options: [{
    name: {
      type: String,
      trim: true,
      required: true
    },
    image: {
      type: String,
      trim: true,
      required: true,
      default: 'default.png'
    },
    relatedStyles: [{
      type: Schema.Types.ObjectId,
      ref: 'Style'
    }],
    answered: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
});

questionSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  return obj;
};

var Question = mongoose.model('Question', questionSchema);
module.exports = Question;
