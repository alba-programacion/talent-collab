const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  document: { type: String, required: true },
  sourceInstitutionId: { type: String, ref: 'Institution' },
  targetVacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' },
  status: { type: String, default: 'Disponible' }, // Disponible, En Proceso, Aprobado, Rechazado
  rejectedReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);
