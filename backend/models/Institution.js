const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  _id: { type: String }, // Explicit string ID to match mock users ('A', 'B')
  name: { type: String, required: true },
  profile: { type: String, default: 'General' },
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);
