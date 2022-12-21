const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  socketid: { type: String, required: true },
  username: { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);