const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VolunteerApplicationSchema = new mongoose.Schema({
  event      : { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  volunteer  : { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  message    : { type: String, required: true },
  status     : { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  createdAt  : { type: Date, default: Date.now },
});
module.exports = mongoose.model('VolunteerApplication', VolunteerApplicationSchema);
