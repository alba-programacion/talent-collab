import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { Calendar, AlertCircle, CheckCircle2, FileText, Banknote } from 'lucide-react';

const Tareas = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [outcome, setOutcome] = useState('Aprobado');
  const [rejectedReason, setRejectedReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}!/api/tasks?email=${user.email}`);
      const data = await res.json();
      setTasks(data);
    } catch(e) { console.error(e) }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const handleResolve = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    
    try {
      // 1. Update CV Status
      const resCv = await fetch(`${API_URL}!/api/cvs/${selectedTask.cvId._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: outcome, rejectedReason: outcome === 'Rechazado' ? rejectedReason : '' })
      });
      if(!resCv.ok) throw new Error('Error al actualizar status del CV');
      
      // 2. Complete Task
      const resTask = await fetch(`${API_URL}!/api/tasks/${selectedTask.id}/complete`, {
        method: 'PATCH'
      });
      if(!resTask.ok) throw new Error('Error al completar la tarea');
      
      setSuccess('¡Tarea resuelta exitosamente!');
      setSelectedTask(null);
      fetchTasks();
    } catch(err) { setError(err.message); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bandeja de Trámites y Tareas</h1>
        <p className="text-slate-500 dark:text-slate-400">Revisa las postulaciones directas y evita multas por vencimiento.</p>
      </div>
      
      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map(t => (
            <div key={t.id} className={`glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden transition-all ${t.status === 'COMPLETED' ? 'opacity-60 grayscale-[50%]' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${t.status==='COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{t.status}</span>
                  <span className="text-sm text-slate-500 font-medium">{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Revisión de Candidato: {t.cvId?.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 italic">"{t.description}"</p>
                
                <div className="flex flex-col gap-2 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400"><FileText className="w-4 h-4"/> Vacante Objetivo: {t.vacancyId?.role || 'Bolsa General'}</div>
                  <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"><Banknote className="w-4 h-4"/> Origen del CV: Inst. {t.cvId?.sourceInstitutionId || 'Directa/Externa'} (Enviado por: {t.senderEmail})</div>
                </div>
              </div>
              
              {/* SLA & FINE SECTION */}
              <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Límite SLA</h4>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-4">{new Date(t.dueDate).toLocaleDateString()}</p>
                
                {t.status !== 'COMPLETED' && (
                  <div className={`p-3 rounded-xl w-full flex flex-col items-center justify-center gap-1 font-bold ${t.fine > 0 ? 'bg-red-100 text-red-700 border border-red-200 shadow-xl shadow-red-500/20' : 'bg-emerald-50 text-emerald-600'}`}>
                    {t.fine > 0 ? <><AlertCircle className="w-5 h-5"/> Multa Activa:<br/> <span className="text-2xl">${t.fine}</span></> : <><CheckCircle2 className="w-5 h-5"/> A tiempo <br/><span className="text-xs font-medium">(Sin multas)</span></>}
                  </div>
                )}
                {t.status === 'COMPLETED' && (
                   <div className="text-indigo-600 font-semibold flex flex-col items-center gap-2"><CheckCircle2 className="w-6 h-6"/> Trámite Resuelto</div>
                )}
              </div>
              
              {t.status !== 'COMPLETED' && (
                <div className="flex items-center">
                   <button onClick={()=>setSelectedTask(t)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium w-full md:w-auto h-fit shadow-xl shadow-indigo-500/30">Resolver</button>
                </div>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="glass-panel p-12 rounded-3xl text-center">
              <CheckCircle2 className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Al día</h3>
              <p className="text-slate-500">No tienes tareas asignadas a tu correo en este momento.</p>
            </div>
          )}
        </div>
      )}

      {/* RESOLVE MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={()=>setSelectedTask(null)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden glass-panel" onClick={e=>e.stopPropagation()}>
             <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between">
               <h2 className="text-xl font-bold dark:text-white">Dictaminar Postulación</h2>
             </div>
             <form onSubmit={handleResolve} className="p-6 space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl mb-4 text-center border border-slate-200 dark:border-slate-700">
                  <a href={`${API_URL}!/uploads/${selectedTask.cvId?.document}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg hover:underline"><FileText/> Ver Currículum ({selectedTask.cvId?.name})</a>
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-1">Determinar Resultado</label>
                  <select value={outcome} onChange={e=>setOutcome(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white">
                    <option value="Aprobado">Aprobar CV (Contratado / Pasa a entrevista)</option>
                    <option value="Rechazado">Rechazar CV (Descartado)</option>
                  </select>
                </div>
                
                {outcome === 'Rechazado' && (
                  <div>
                    <label className="block text-sm font-medium dark:text-slate-300 mb-1">Motivo de Rechazo</label>
                    <textarea value={rejectedReason} onChange={e=>setRejectedReason(e.target.value)} required rows="3" className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none dark:text-white"></textarea>
                  </div>
                )}
                
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all">
                  Completar Tarea
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tareas;
