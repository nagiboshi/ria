const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  token: { type: String, required: true },
  platform: { type: String, required: true },
  user: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
});


module.exports = mongoose.model('Device', DeviceSchema);