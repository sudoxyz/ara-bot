const mongoose = require('mongoose');

const ROLES = Object.freeze({
  SPEAKER: 'speaker',
  STATS: 'stats'
});

const bookingSchema = new mongoose.Schema({
  timeSlot: {
    type: Date,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  reminder: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  role: {
    type: String,
    default: ROLES.SPEAKER
  },
  stage: {
    type: Number, 
    default: 1
  },
  expireAt: {
    type: Date,
    required: true
  }
});

const Booking = mongoose.model('booking', bookingSchema);

module.exports = {
  Booking,
  ROLES
};