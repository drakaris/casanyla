var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: {
    type: String,
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
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    content: String,
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
