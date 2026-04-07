import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { 
  FileText, Plus, AlertCircle, Search, Filter, 
  ChevronRight, Building, CheckCircle2, Clock, ShieldAlert,
  ArrowUpRight, Download, Eye
} from 'lucide-react';

const CVs = () => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCvs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/cvs');
      const data = await res.json();
      
      // Yesterday's Logic: Filter by institution if not global admin
      if (user.role === 'admin') {
        setCvs(data);
      } else {
        setCvs(data.filter(c => (c.sourceInstitutionId?._id || c.sourceInstitutionId) === user.institutionId));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCvs();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!file) return setError('Selecciona un archivo PDF');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('sourceInstitutionId', user.institutionId);
    formData.append('document', file);

    try {
      const res = await fetch('http://localhost:5000/api/cvs', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      setSuccess('Perfil integrado exitosamente a la Red.');
      setForm({ name: '', email: '' });
      setFile(null);
      fetchCvs();
    } catch (err) { setError(err.message); }
  };

  const filteredCvs = cvs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      {/* Header Premium Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
            Módulo de Reclutamiento
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfiles CV</span></h1>
          <p className="text-slate-500 font-medium max-w-xl">Administra la base de talentos institucional y monitorea las postulaciones activas en la red.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white dark:bg-slate-910 border border-slate-200 dark:border-slate-800 rounded-2xl w-full md:w-80 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Upload Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-910 p-8 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 sticky top-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Plus className="w-6 h-6 text-white" />
              </div>
              Carga de Talento
            </h3>
            
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Institución Emisora</p>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Building className="w-4 h-4 text-blue-500" /> {user?.institutionId || 'Administración Central'}</p>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm mb-4 border border-red-100 flex items-center gap-3 font-bold"><ShieldAlert className="w-5 h-5"/> {error}</div>}
            {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm mb-4 border border-emerald-100 flex items-center gap-3 font-bold"><CheckCircle2 className="w-5 h-5"/> {success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Candidato</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 transition-colors dark:text-white font-bold" required placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email de Contacto</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 transition-colors dark:text-white font-bold" required placeholder="juan@correo.com" />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Expediente PDF</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs text-slate-500 font-bold">{file ? file.name : 'Haz clic para subir'}</p>
                   </div>
                   <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                </label>
              </div>
              <button type="submit" disabled={!user?.institutionId && user.role !== 'admin'} className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-xl transition-all uppercase tracking-widest text-xs mt-4">
                Aportar Talento a la Red
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Base de Talentos <span className="ml-2 px-3 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm text-slate-500">{filteredCvs.length}</span></h3>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Filter className="w-5 h-5"/></button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="flex flex-col items-center py-20 gap-4">
                 <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                 <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Sincronizando Base de Datos...</span>
               </div>
            ) : filteredCvs.length === 0 ? (
               <div className="bg-slate-50 dark:bg-slate-910 p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Sin perfiles registrados</h4>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Los candidatos que registres aparecerán en esta lista vinculados permanentemente a tu entidad.</p>
               </div>
            ) : filteredCvs.map(cv => (
              <div key={cv.id} className="group bg-white dark:bg-slate-910 p-6 rounded-[2rem] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-black shadow-inner">
                  {cv.name.charAt(0)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white truncate max-w-[200px]">{cv.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      cv.status === 'Disponible' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      cv.status === 'En Proceso' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      cv.status === 'Aprobado' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                      'bg-red-500/10 text-red-600 border-red-500/20'
                    }`}>
                      {cv.status}
                    </span>
                    {cv.targetVacancyId && (
                      <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
                         Postulación Directa
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-400 flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> Registrado el {new Date(cv.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col md:items-end gap-3 px-4">
                   <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{cv.email}</p>
                   {cv.targetVacancyId ? (
                     <div className="text-[10px] font-black text-indigo-500 flex items-center gap-1 uppercase tracking-tighter">
                        <ArrowUpRight className="w-3 h-3"/> {cv.targetVacancyId.role || 'Vacante Vinculada'}
                     </div>
                   ) : (
                     <div className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <Building className="w-3 h-3"/> Base Local
                     </div>
                   )}
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                   <a 
                     href={`http://localhost:5000/uploads/${cv.document}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                   >
                     <Eye className="w-5 h-5"/>
                   </a>
                   <a 
                     href={`http://localhost:5000/uploads/${cv.document}`} 
                     download
                     className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                   >
                     <Download className="w-5 h-5"/>
                   </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVs;
