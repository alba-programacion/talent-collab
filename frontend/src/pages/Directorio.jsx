import React, { useEffect, useState } from 'react';
import { Book, Building, Phone, Mail, ShieldCheck, MapPin, Globe, Search } from 'lucide-react';
import { useAuth } from '../App';

const Directorio = () => {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInstitutions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/institutions');
      const data = await res.json();
      setInstitutions(data);
    } catch(e) { console.error(e) }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchInstitutions(); }, []);

  const filtered = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.profile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header Premium Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent blur-3xl rounded-full translate-x-1/2 -translate-y-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
              Red de Colaboración AMIB
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">Directorio<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">Institucional</span></h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">Conecta con los titulares y suplentes de las entidades federadas en el ecosistema de talento.</p>
          </div>
          
          <div className="w-full md:w-96 relative group">
             <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-hover:text-indigo-400 transition-colors" />
             <input 
               type="text" 
               placeholder="Buscar institución o perfil..." 
               value={searchTerm}
               onChange={(e)=>setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all font-bold placeholder-slate-500 backdrop-blur-md"
             />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Cargando Red...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map(inst => (
            <div key={inst.id} className="group relative bg-white dark:bg-slate-910 rounded-[2.5rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.15)] border border-slate-100 dark:border-slate-800/50 transition-all hover:-translate-y-2 overflow-hidden">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-bl-[5rem] -mr-12 -mt-12 transition-transform group-hover:scale-150 group-hover:rotate-12 duration-700"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-5">
                   {inst.logo ? (
                     <img src={`http://localhost:5000/uploads/${inst.logo}`} alt={inst.name} className="w-20 h-20 object-cover rounded-[1.5rem] shadow-xl border-4 border-white dark:border-slate-800" />
                   ) : (
                     <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center rounded-[1.5rem] text-white font-black text-3xl shadow-xl shadow-indigo-500/30">
                       {inst.name.charAt(0)}
                     </div>
                   )}
                   <div className="flex-1">
                      <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 inline-block mb-1">{inst.profile}</div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{inst.name}</h3>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                         <MapPin className="w-3 h-3 text-indigo-500" /> Sede Central: MX
                      </div>
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                  {/* Titular Card */}
                  <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 group-hover:border-indigo-500/20 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Titular</span>
                       <ShieldCheck className="w-4 h-4 text-indigo-500 opacity-50" />
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-200 mb-3">{inst.titularName || 'Sin asignar'}</p>
                    <div className="flex flex-col gap-2">
                      <a href={`mailto:${inst.titularMail}`} className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        {inst.titularMail || 'contacto@inst.org'}
                      </a>
                      <a href={`tel:${inst.titularPhone}`} className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        {inst.titularPhone || '---'}
                      </a>
                    </div>
                  </div>

                  {/* Suplente Card */}
                  <div className="p-5 rounded-[2rem] bg-indigo-500/5 dark:bg-indigo-500/5 border border-dashed border-indigo-500/20">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">Delegado Suplente</span>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{inst.suplenteName || 'Por definir'}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <a href={`mailto:${inst.suplenteMail}`} className="text-slate-400 hover:text-indigo-500 transition-colors"><Mail className="w-4 h-4" /></a>
                       <a href={`tel:${inst.suplentePhone}`} className="text-slate-400 hover:text-indigo-500 transition-colors"><Phone className="w-4 h-4" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Building className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 dark:text-white">No se encontraron resultados</h3>
               <p className="text-slate-500 font-medium">Prueba con un término diferente o verifica la clave institucional.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Directorio;
