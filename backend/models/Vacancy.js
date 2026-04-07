const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  role: { type: String, required: true },
  salary: { type: String },
  description: { type: String },
  institutionId: { type: String, ref: 'Institution' }, 
  status: { type: String, default: 'Abierta' },
}, { timestamps: true });

module.exports = mongoose.model('Vacancy', vacancySchema);
