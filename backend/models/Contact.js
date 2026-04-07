const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  institutionName: { type: String, required: true },
  titular: { type: String, required: true },
  titularEmail: { type: String, required: true },
  titularPhone: { type: String, required: true },
  suplente: { type: String },
  suplenteEmail: { type: String },
  suplentePhone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
