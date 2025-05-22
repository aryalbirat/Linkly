/**
 * URL Model
 * Defines the schema for the URL shortening service
 */
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
    unique: true,
  },
  origUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Url', urlSchema);