const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  phone: { type: String, required: true }, // 🔹 нове поле

  roles: {
    type: [String],
    enum: ['Організатор', 'Волонтер', 'Інвестор'],
    required: true
  },

  photo: {
    type: String,
    default: '' 
  },

bio: { type: String, default: '' },
avgRating: { type: Number, default: 0 },

  donations: [{
  event : { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  amount  : Number,
  date    : { type: Date, default: Date.now }
}],

  organizerInfo: {
    organizedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
