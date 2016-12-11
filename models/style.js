var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var styleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  images: [{
    name: {
      type: String,
      trim: true,
      required: true
    },
    file: {
      type: String,
      trim: true,
      required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: false
    },
    order: {
      type: Number,
      default: 0
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
}, {
  timestamps: true
});

styleSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  return obj;
};

var Style = mongoose.model('Style', styleSchema);
module.exports = Style;
