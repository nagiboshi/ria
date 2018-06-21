const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, unique: true, required: true },
  body: { type: String, unique: true, required: true },
  image: { data: Buffer, contentType: String },
  created: { type: Number, default: Date.now() },
  riskGroups: [{type: Schema.Types.ObjectId, ref: 'RiskGroup' }] 
});

module.exports = mongoose.model('Article', ArticleSchema);
