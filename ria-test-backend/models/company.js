const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  code: { type: String, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  created: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('Company', CompanySchema);
