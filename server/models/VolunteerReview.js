const mongoose = require('mongoose');
const { Schema, model } = mongoose; 

const VolunteerReviewSchema = new Schema({
  volunteer : { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  author    : { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true }, // хто залишив
  text      : { type: String,  required: true },
  rating    : { type: Number,  min: 1, max: 5 },
  createdAt : { type: Date, default: Date.now },
});
module.exports = mongoose.model('VolunteerReview', VolunteerReviewSchema);