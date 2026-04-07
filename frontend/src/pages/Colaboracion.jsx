import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { Send, Inbox, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const Colaboracion = () => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recibidos');
  
  // For rejecting
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // For sending SLA
  const [applyForm, setApplyForm] = useState({ name: '', email: '', description: '', targetEmail: '', dueDate: '' });
  const [documentFile, setDocumentFile] = useState(null);
  const [collabError, setCollabError] = useState('');
  const [collabSuccess, setCollabSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [cvsRes, instRes] = await Promise.all([
        fetch(API_URL + '/api/cvs'),
        fetch(API_URL + '/api/institutions')
      ]);
      setCvs(await cvsRes.json());
      setInstitutions(await instRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  // CVs recibidos en mi institución
  const incomingCvs = cvs.filter(c => c.targetInstitutionId === user.institutionId && c.status === 'En Proceso');
  // CVs enviados por mi institución que están en proceso o disponibles para ser enviados
  const myAvailableCvs = cvs.filter(c => c.sourceInstitutionId === user.institutionId && c.status === 'Disponible');
  const mySentCvs = cvs.filter(c => c.sourceInstitutionId === user.institutionId && c.targetInstitutionId);

  const handleStatusChange = async (cvId, newStatus) => {
    if (newStatus === 'Rechazado' && !rejectReason) return;
    try {
      await fetch(`${API_URL}!/api/cvs/${cvId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectedReason: rejectReason })
      });
      setRejectingId(null);
      setRejectReason('');
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleShareSla = async (e) => {
    e.preventDefault();
    setCollabError(''); setCollabSuccess('');
    if (!documentFile) return setCollabError('Por favor adjunta el CV (PDF/Word).');
    
    const formData = new FormData();
    formData.append('name', applyForm.name);
    formData.append('email', applyForm.email);
    formData.append('description', applyForm.description);
    formData.append('targetEmail', applyForm.targetEmail);
    formData.append('dueDate', applyForm.dueDate);
    formData.append('senderEmail', user.email);
    if (user.institutionId) formData.append('sourceInstitutionId', user.institutionId);
    formData.append('document', documentFile);

    try {
      const res = await fetch(API_URL + '/api/cvs/collab', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar CV');
      
      setCollabSuccess('¡CV enviado! Tarea SLA asignada al correo destino.');
      setApplyForm({ name: '', email: '', description: '', targetEmail: '', dueDate: '' });
      setDocumentFile(null);
      const fileInput = document.getElementById('collab-file');
      if (fileInput) fileInput.value = '';
      fetchData(); 
    } catch (err) {
      setCollabError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vinculación Bilateral</h1>
        <p className="text-slate-500 dark:text-slate-400">Espacio privado para compartir y hacer seguimiento de talento entre instituciones.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('recibidos')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'recibidos' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Inbox className="w-5 h-5" /> Recibidos <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 py-0.5 px-2 rounded-full text-xs">{incomingCvs.length}</span>
        </button>
        <button 
          onClick={() => setActiveTab('enviar')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === 'enviar' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Send className="w-5 h-5" /> Enviar CV / Historial
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mx-auto"></div></div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl min-h-[400px]">
          {activeTab === 'recibidos' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Perfiles a Revisar</h3>
              {incomingCvs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl max-w-lg mx-auto bg-slate-50/50 dark:bg-slate-900/50">
                  <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500">No hay currículums pendientes por revisar.</p>
                </div>
              ) : incomingCvs.map(cv => (
                <div key={cv.id} className="p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-blue-500/30">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">{cv.name} <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-md">Origen: Inst. {cv.sourceInstitutionId}</span></h4>
                    <p className="text-sm text-slate-500">Documento: {cv.document}</p>
                    <div className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit">
                      <AlertCircle className="w-3 h-3" /> Tienes hasta el {cv.collaborationDeadline} para contestar, sino el estatus se cierra automáticamente.
                    </div>
                  </div>
                  
                  {rejectingId === cv.id ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <input 
                        type="text" 
                        placeholder="Escribe el motivo de rechazo..." 
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        className="px-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 flex-1 md:w-56 outline-none dark:text-white transition-all shadow-sm"
                      />
                      <button onClick={() => handleStatusChange(cv.id, 'Rechazado')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/30">Confirmar</button>
                      <button onClick={() => setRejectingId(null)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium px-2 py-1">Cancelar</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button onClick={() => handleStatusChange(cv.id, 'Aprobado')} className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 dark:hover:bg-emerald-900/40 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto">
                        <CheckCircle2 className="w-4 h-4" /> Aprobar Perfil
                      </button>
                      <button onClick={() => setRejectingId(cv.id)} className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 dark:hover:bg-red-900/40 px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto">
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'enviar' && (
            <div className="space-y-8">
              <div className="bg-white/50 dark:bg-slate-800/20 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generar Trámite de Envío de CV (SLA)</h3>
                  <p className="text-sm text-slate-500">Al enviar el perfil, la acción quedará certificada bajo sello de colaboración para la Institución Aportadora ({user?.institutionId || 'No asignada'}).</p>
                </div>
                
                {collabError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4 border border-red-200">{collabError}</div>}
                {collabSuccess && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm mb-4 border border-emerald-200">{collabSuccess}</div>}

                <form onSubmit={handleShareSla} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre del Candidato</label>
                      <input type="text" value={applyForm.name} onChange={e=>setApplyForm({...applyForm, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo C.</label>
                      <input type="email" value={applyForm.email} onChange={e=>setApplyForm({...applyForm, email: e.target.value})} className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">¿A qué correo asignar la Tarea SLA?</label>
                      <input type="email" value={applyForm.targetEmail} onChange={e=>setApplyForm({...applyForm, targetEmail: e.target.value})} placeholder="gerente@institucion.com" className="w-full px-4 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-red-600 dark:text-red-400 mb-1">🚨 Fecha Límite de SLA</label>
                      <input type="date" value={applyForm.dueDate} onChange={e=>setApplyForm({...applyForm, dueDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/30 dark:bg-red-900/10 dark:text-white outline-none focus:ring-2 focus:ring-red-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mensaje de presentación (Cuerpo del correo)</label>
                    <textarea value={applyForm.description} onChange={e=>setApplyForm({...applyForm, description: e.target.value})} rows="3" className="w-full px-4 py-2 rounded-xl border dark:border-slate-700 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Archivo CV (PDF/Word)</label>
                    <input id="collab-file" type="file" onChange={e=>setDocumentFile(e.target.files[0])} accept=".pdf,.doc,.docx" className="w-full px-4 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 dark:text-white transition-colors cursor-pointer" required />
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={!user?.institutionId} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all text-lg flex justify-center items-center gap-2">
                      <Send className="w-5 h-5"/> {user?.institutionId ? 'Enviar y Generar Trámite' : 'Envío Bloqueado (Sin Institución)'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Colaboracion;
