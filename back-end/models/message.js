const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  text: { type: String, required: true },
  socketid: { type: String, required: true },
  date: { type: Date, required: true },
  username: { type: String, required: false },
});

module.exports = mongoose.model('ChatSocketio', messageSchema);