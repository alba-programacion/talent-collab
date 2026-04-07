const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  document: { type: String, required: true },
  sourceInstitutionId: { type: String, ref: 'Institution' },
  targetInstitutionId: { type: String },
  targetVacancyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' },
  status: { type: String, default: 'Disponible' }, // Disponible, En Proceso, Aprobado, Rechazado, Pausado
  rejectedReason: { type: String, default: '' },
  rejectedBy: { type: String, default: '' },
  history: [{
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);
