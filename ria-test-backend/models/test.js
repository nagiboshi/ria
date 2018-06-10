const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  title: { type: String, required: true },
  data: {type: String, required: true},
  created: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('Test', RequestSchema);