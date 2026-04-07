import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { Briefcase, Building, Clock, Users, FileText, X, Plus } from 'lucide-react';

const Vacantes = () => {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState([]);
  const [allCvs, setAllCvs] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  // Forms state
  const [form, setForm] = useState({ role: '', salary: '', description: '', institutionId: '' });
  const [applyForm, setApplyForm] = useState({ name: '', email: '' });
  const [requestSlaForm, setRequestSlaForm] = useState({ targetEmail: '', description: '', dueDate: '' });
  const [documentFile, setDocumentFile] = useState(null);
  
  // Messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchVacancies = async () => {
    try {
      const res = await fetch(API_URL + '/api/vacancies');
      const data = await res.json();
      setVacancies(data);
    } catch (e) {
      console.error("Error", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCvs = async () => {
    try {
      const res = await fetch(API_URL + '/api/cvs');
      const data = await res.json();
      setAllCvs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const res = await fetch(API_URL + '/api/institutions');
      const data = await res.json();
      setInstitutions(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVacancies();
    if (user) {
      fetchAllCvs();
      fetchInstitutions(); // all users need institutions list to publish vacancies
    }
  }, [user]);

  const handleAddVacancy = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    if (!user?.institutionId) {
      setError('No tienes una institución asignada para publicar esta vacante.');
      return;
    }

    try {
      const res = await fetch(API_URL + '/api/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, institutionId: user?.institutionId })
      });
      if (!res.ok) throw new Error('Error al crear vacante');
      setForm({ role: '', salary: '', description: '', institutionId: '' });
      setShowAddModal(false);
      fetchVacancies();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleApplyCv = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!documentFile) return setError('Por favor adjunta el CV (PDF/Word).');
    
    const formData = new FormData();
    formData.append('name', applyForm.name);
    formData.append('email', applyForm.email);
    formData.append('targetVacancyId', selectedVacancy.id);
    if (user.institutionId) formData.append('sourceInstitutionId', user.institutionId);
    formData.append('document', documentFile);

    try {
      const res = await fetch(API_URL + '/api/cvs/vacancy', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar CV');
      
      setSuccess('¡CV postulado exitosamente a la vacante!');
      setApplyForm({ name: '', email: '' });
      setDocumentFile(null);
      fetchVacancies(); 
      fetchAllCvs();
      setSelectedVacancy(prev => ({...prev, cvCount: prev.cvCount + 1}));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Red de Vacantes</h1>
          <p className="text-slate-500 dark:text-slate-400">Explora las posiciones abiertas en las instituciones asociadas.</p>
        </div>
        {(user?.role === 'management' || user?.role === 'admin') && (
          <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nueva Vacante
          </button>
        )}
      </div>

      {error && !showAddModal && !selectedVacancy && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
      {success && !showAddModal && !selectedVacancy && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm mb-4 border border-emerald-200">{success}</div>}

      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((v) => (
            <div 
              key={v.id} 
              onClick={() => { setSelectedVacancy(v); setError(''); setSuccess(''); }}
              className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Briefcase className="w-6 h-6 text-blue-500" />
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  v.status === 'Abierta' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  v.status === 'Pausada' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {v.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{v.role}</h3>
              
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2 gap-2">
                <Building className="w-4 h-4" />
                <span>{v.institutionName}</span>
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4 gap-2">
                <Clock className="w-4 h-4" />
                <span>Publicada: {v.date}</span>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg">
                  <Users className="w-4 h-4" />
                  <span>{v.cvCount} CVs vinculados</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Vacancy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden glass-panel">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold dark:text-white">Publicar Nueva Vacante</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            {error && showAddModal && <div className="m-6 mb-0 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}
            
            <form onSubmit={handleAddVacancy} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-slate-300 mb-1">Rol / Puesto</label>
                <input type="text" value={form.role} onChange={e=>setForm({...form, role: e.target.value})} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-slate-300 mb-1">Salario Ofrecido</label>
                <input type="text" value={form.salary} onChange={e=>setForm({...form, salary: e.target.value})} placeholder="Ej. $20,000 - $25,000 MXN" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-slate-300 mb-1">Descripción de la vacante</label>
                <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows="4" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white resize-none" required></textarea>
              </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-1">Institución que Publica</label>
                  <p className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold border border-slate-300 dark:border-slate-700 rounded-xl cursor-not-allowed">
                    {user?.institutionName || 'Tu institución (Asignación automática)'}
                  </p>
                </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all">
                Publicar Vacante
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expanded Vacancy Detail Modal */}
      {selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedVacancy(null)}>
           {/* Stop propagation to avoid closing modal when clicking inside it */}
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start p-6 border-b border-slate-200 dark:border-slate-800 relative">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 inline-block">Inst. {selectedVacancy.institutionId}</span>
                  {selectedVacancy.institutionId === user?.institutionId ? (
                    <select 
                      value={selectedVacancy.status} 
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-2 py-1 text-xs font-bold rounded-full border outline-none bg-slate-50 dark:bg-slate-800 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Abierta">Abierta</option>
                      <option value="Pausada">Pausada</option>
                      <option value="Cerrada">Cerrada</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold rounded-full border bg-slate-50 dark:bg-slate-800/50 dark:text-white border-slate-300 dark:border-slate-600 text-slate-600">
                      Estatus: {selectedVacancy.status}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold dark:text-white">{selectedVacancy.role}</h2>
                <div className="flex items-center text-sm text-slate-500 mt-2 gap-4">
                  <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {selectedVacancy.institutionName}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {selectedVacancy.date}</span>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedVacancy(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {error && selectedVacancy && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}
              {success && selectedVacancy && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm border border-emerald-200">{success}</div>}

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-2">Salario</h4>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">{selectedVacancy.salary || 'No especificado'}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-2">Descripción</h4>
                <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 whitespace-pre-line">
                  {selectedVacancy.description || 'Sin descripción detallada.'}
                </div>
              </div>

              {/* Lista de CVs Vinculados a esta Vacante */}
              <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" /> Candidatos Postulados</h4>
                <div className="space-y-3">
                  {allCvs.filter(c => (c.targetVacancyId?._id || c.targetVacancyId) === selectedVacancy.id).length === 0 ? (
                    <p className="text-slate-500 text-sm italic bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">AÚN NO HAY CVs VINCULADOS A ESTA VACANTE</p>
                  ) : (
                    allCvs.filter(c => (c.targetVacancyId?._id || c.targetVacancyId) === selectedVacancy.id).map(cv => (
                      <div key={cv.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-500 transition-colors">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {cv.name}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${cv.status === 'Rechazado' ? 'bg-red-100 text-red-700' : cv.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>{cv.status}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
                            <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md font-mono text-indigo-600 dark:text-indigo-400">Inst: {cv.sourceInstitutionName || cv.sourceInstitutionId || 'Directa'}</span>
                            <span>| {cv.email}</span>
                            <span>| Vinculado el: {new Date(cv.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <a href={`${API_URL}!/uploads/${cv.document}`} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-900/30 px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"><FileText className="w-4 h-4"/> Ver PDF</a>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Enviar CV a Vacante o Generar Tarea */}
              {selectedVacancy.institutionId === user?.institutionId ? (
              <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 pb-2">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">Solicitar Candidato a la Red (SLA)</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Genera un Trámite formal para que otra institución te envíe candidatos.</p>
                </div>
                <form onSubmit={handleRequestSla} className="space-y-4 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo (A quién solicitar)</label>
                      <input type="email" placeholder="gerente@institucion.com" value={requestSlaForm.targetEmail} onChange={e=>setRequestSlaForm({...requestSlaForm, targetEmail: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Fecha Límite (SLA)</label>
                      <input type="date" value={requestSlaForm.dueDate} onChange={e=>setRequestSlaForm({...requestSlaForm, dueDate: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mensaje Opcional</label>
                    <textarea value={requestSlaForm.description} onChange={e=>setRequestSlaForm({...requestSlaForm, description: e.target.value})} rows="2" className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">Generar Trámite SLA</button>
                </form>
              </div>
              ) : (
              <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 pb-2">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Postular Candidato</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sube el CV directamente a esta vacante para que la institución pueda revisarlo en su base de datos.</p>
                </div>
                
                <form onSubmit={handleApplyCv} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Nombre del Candidato</label>
                      <input type="text" value={applyForm.name} onChange={e=>setApplyForm({...applyForm, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Correo C.</label>
                      <input type="email" value={applyForm.email} onChange={e=>setApplyForm({...applyForm, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Archivo CV (PDF/Word)</label>
                    <input type="file" onChange={e=>setDocumentFile(e.target.files[0])} accept=".pdf,.doc,.docx" className="w-full px-3 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 dark:text-white transition-colors cursor-pointer" required />
                  </div>
                  <button type="submit" disabled={!user?.institutionId} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all">
                    {user?.institutionId ? 'Subir y Postular Candidato' : 'Bloqueado: Requiere Institución Aportadora'}
                  </button>
                </form>
              </div>
              )}
            </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Vacantes;
