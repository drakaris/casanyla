var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  estimate: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    trim: true,
    required: true
  },
  designer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  milestones: [{
    name: {
      type: String,
      trim: true,
      required: true
    },
    deadline: {
      type: Date,
      required: true,
      default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000)
    },
    content: {
      type: String,
      trim: true,
    },
    updated: {
      type: Date,
      default: Date.now,
      required: true
    }
  }]
}, {
  timestamps: true
});

projectSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  return obj;
};

var Project = mongoose.model('Project', projectSchema);
module.exports = Project;
