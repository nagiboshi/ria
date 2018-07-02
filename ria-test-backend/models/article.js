const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, unique: false, required: true },
  body: { type: String, unique: false, required: true },
  image: { type: String, unique: false, required: true },
  created: { type: Number, default: Date.now() },
  riskGroups: [{type: Schema.Types.ObjectId, ref: 'RiskGroup' }] 
});

module.exports = mongoose.model('Article', ArticleSchema);
