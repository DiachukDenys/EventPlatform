const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  amount: { type: Number, required: true },
  message: String,
  createdAt: { type: Date, default: Date.now },
  goal: { type: Number }
});

module.exports = mongoose.model('Payment', paymentSchema);
