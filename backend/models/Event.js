
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  images: [{type: String}],
  collectedAmount: {
  type: Number,
  default: 0,
},
targetAmount: {
  type: Number,
  required: true,
},
});

module.exports = mongoose.model('Event', eventSchema);
