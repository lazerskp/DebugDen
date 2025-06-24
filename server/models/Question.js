const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    validate: [val => val.length <= 5, 'Cannot have more than 5 tags']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  // Store who voted and how (1 for up, -1 for down)
  voters: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote: { type: Number, enum: [1, -1] }
  }], default: [], // Ensure default empty array
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }] // Assuming 'Answer' model exists
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
