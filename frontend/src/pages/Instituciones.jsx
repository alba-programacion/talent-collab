import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { Building, Users as UsersIcon, Shield, Plus, X } from 'lucide-react';

const Instituciones = () => {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddInst, setShowAddInst] = useState(false);
  const [formInst, setFormInst] = useState({ _id: '', name: '', profile: 'Múltiple' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resInst, resUsers] = await Promise.all([
        fetch(API_URL + '/api/institutions'),
        fetch(API_URL + '/api/users')
      ]);
      setInstitutions(await resInst.json());
      setUsers(await resUsers.json());
    } catch(e) { console.error(e) }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData() }, []);

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-bold glass-panel border border-red-200 mt-10 rounded-2xl max-w-lg mx-auto shadow-xl"><Shield className="w-16 h-16 mx-auto mb-4"/> Acceso Denegado. Se requiere nivel Administrador Global.</div>;
  }

  const handleAddInstitution = async (e) => {
    e.preventDefault();
    try {
      await fetch(API_URL + '/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInst)
      });
      setShowAddInst(false);
      setFormInst({ _id: '', name: '', profile: 'Múltiple' });
      fetchData();
    } catch(err) { alert(err.message) }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await fetch(`${API_URL}!/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchData();
    } catch(err) { alert('Error actualizando usuario'); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">Panel Directivo</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Supervisión integral de Grupos y Roles.</p>
        </div>
        <button onClick={()=>setShowAddInst(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5"/> Registrar Entidad
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin mx-auto"></div></div>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Institutions Card */}
          <div className="glass-panel p-8 rounded-3xl h-fit border-t-4 border-t-indigo-500 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Building className="text-indigo-500"/> Entidades Registradas</h2>
            <div className="space-y-4">
              {institutions.map(inst => (
                <div key={inst.id} className="p-5 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{inst.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">Clave Interna: <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded text-indigo-600 dark:text-indigo-400"> {inst.id}</span></p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{inst.profile}</span>
                    <div className="mt-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                      {users.filter(u => (u.institutionId?._id || u.institutionId) === inst.id).length} Usuarios Asignados
                    </div>
                  </div>
                </div>
              ))}
              {institutions.length === 0 && <p className="text-center text-slate-500 py-4">No hay instituciones registradas.</p>}
            </div>
          </div>


        </div>
      )}

      {/* ADD INSTITUTION MODAL */}
      {showAddInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" onClick={()=>setShowAddInst(false)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden glass-panel" onClick={e=>e.stopPropagation()}>
             <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <h2 className="text-xl font-bold dark:text-white flex items-center gap-2"><Building className="text-indigo-500"/> Alta de Institución</h2>
               <button type="button" onClick={() => setShowAddInst(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <X className="w-6 h-6" />
               </button>
             </div>
             <form onSubmit={handleAddInstitution} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-1">Clave de la Entidad (ej. 'A' , 'UAA')</label>
                  <input type="text" value={formInst._id} onChange={e=>setFormInst({...formInst, _id: e.target.value.toUpperCase()})} required placeholder="Identificador corto" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-bold tracking-wider" />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-1">Nombre Oficial</label>
                  <input type="text" value={formInst.name} onChange={e=>setFormInst({...formInst, name: e.target.value})} required placeholder="Ej. Universidad Anáhuac" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-1">Perfil Corporativo</label>
                  <input type="text" value={formInst.profile} onChange={e=>setFormInst({...formInst, profile: e.target.value})} required placeholder="Tech, Salud, Manufactura..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder-slate-400" />
                </div>
                
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-xl shadow-indigo-500/30 transition-all mt-4 text-lg">
                  Integrar a la Red
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instituciones;
