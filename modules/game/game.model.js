const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  userRating: {
    type: Number,
    required: false,
  },
  metacritic: {
    type: Number,
    required: false,
  },
  releasedDate: {
    type: Date,
    required: false,
  },
  addedDate: { type: Date, default: Date.now },
  description: {
    type: String,
    required: false,
  },
  cover: {
    type: String,
    required: false,
  },
  coverCrop: {
    type: String,
    required: false,
  },
  video: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['playing', 'completed', 'dropped', 'wishlist'],
    default: 'playing',
  },
  platforms: {},
  genres: {},
  screenshots: {},
});

module.exports = mongoose.model('Game', gameSchema);
