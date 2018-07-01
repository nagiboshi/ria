const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  token: { type: String, required: true },
  platform: { type: String, required: true },
  user: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
});

DeviceSchema.statics.findOld = async function (email, token) {
  let device = await this.findOne({ "user.email":email, "token": token });

  if (!device) {
    return null;
  }

  return device; 
};

module.exports = mongoose.model('Device', DeviceSchema);