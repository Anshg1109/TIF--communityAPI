const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, maxlength: 64 },
  email: { type: String, maxlength: 128 },
  password: { type: String, maxlength: 64 },
  created_at: { type: Date },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
