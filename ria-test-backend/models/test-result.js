const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestResultSchema = new Schema({
  userId: { type: String, required: true },
  testId: { type: String, required: true },
  result: { type: String, required: true },
  created: { type: Number, default: Date.now() }
});

module.exports = mongoose.model('TestResult', TestResultSchema);
