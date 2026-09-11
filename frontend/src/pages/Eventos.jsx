import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Upload, Edit, Text, Check, AlertCircle, Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth } from '../App';
import { API_URL } from '../config';

const Eventos = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('comites'); // 'comites' | 'feria'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Feria del Libro States
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Committee manual reminder state
  const [sendingReminder, setSendingReminder] = useState(false);

  // Dynamically calculate committees: first Tuesday of each month for the next 12 months
  const getUpcomingCommittees = () => {
    const dates = [];
    const today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth(); // 0-indexed

    for (let i = 0; i < 12; i++) {
      let date = new Date(currentYear, currentMonth, 1);
      while (date.getDay() !== 2) { 
        date.setDate(date.getDate() + 1);
      }
      const reminderDate = new Date(date);
      reminderDate.setDate(reminderDate.getDate() - 1);
      dates.push({
        date: new Date(date),
        reminderDate: new Date(reminderDate),
        monthName: date.toLocaleString('es-ES', { month: 'long' }),
        year: date.getFullYear()
      });
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
    return dates;
  };

  const committees = getUpcomingCommittees();
  const nextCommittee = committees[0];

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/category/feria-libro`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching Book Fair details:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveFeria = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('description', editDescription);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const url = editingEventId 
        ? `${API_URL}/api/events/${editingEventId}`
        : `${API_URL}/api/events/category/feria-libro`;
        
      const method = editingEventId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (res.ok) {
        setSuccess('Evento guardado exitosamente.');
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl('');
        setEditingEventId(null);
        setEditTitle('');
        setEditDescription('');
        fetchEvents();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar el evento.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al comunicarse con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
      const res = await fetch(`${API_URL}/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Evento eliminado.');
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendManualReminder = async () => {
    setSendingReminder(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/events/comite/reminder`, { method: 'POST' });
      if (res.ok) {
        setSuccess('Recordatorio manual de comité enviado exitosamente por correo a todos los usuarios.');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al enviar el recordatorio manual.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al comunicarse con el servidor.');
    } finally {
      setSendingReminder(false);
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'management';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Eventos</h1>
          <p className="text-slate-500 dark:text-slate-400">Consulta y edita eventos de la plataforma</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 w-full">
          <button
            onClick={() => setActiveTab('comites')}
            className={`px-6 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'comites' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Comités
            {activeTab === 'comites' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fade-in" />}
          </button>
          <button
            onClick={() => setActiveTab('feria')}
            className={`px-6 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'feria' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Feria del Libro
            {activeTab === 'feria' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-fade-in" />}
          </button>
        </div>
      </div>

      {activeTab === 'comites' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 space-y-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Siguiente Reunión</span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white capitalize">
                  {nextCommittee.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h2>
              </div>
            </div>

            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Dirección</h4>
                  <p className="text-slate-600 dark:text-slate-400">Av. paseo de la república #255, P1</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">Notificaciones Automáticas</h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Se enviará una alerta por correo a todos los usuarios el **lunes previo** a la sesión (el{' '}
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {nextCommittee.reminderDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </span>).
                  </p>
                  
                  {user?.role === 'admin' && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleSendManualReminder}
                        disabled={sendingReminder}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-755 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center gap-2"
                      >
                        {sendingReminder ? 'Enviando...' : 'Enviar Recordatorio Manual por Correo'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-48 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 group-hover:opacity-80 transition-opacity"></div>
              <div className="text-center p-4 relative z-10 space-y-2">
                <MapPin className="w-10 h-10 text-indigo-500 mx-auto animate-bounce" />
                <p className="font-bold text-slate-800 dark:text-white text-sm">Av. paseo de la república #255, P1</p>
                <p className="text-xs text-slate-400">Edificio Corporativo AMIB</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 space-y-6 shadow-xl">
            <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white">Programación Anual</h3>
              <p className="text-xs text-slate-400">Primer martes de cada mes</p>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {committees.map((c, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    idx === 0
                      ? 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 border-indigo-200 dark:border-indigo-800'
                      : 'bg-white/40 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white capitalize">{c.monthName} {c.year}</h4>
                    <p className="text-xs text-slate-400">Sesión: {c.date.toLocaleDateString('es-ES', { day: 'numeric' })} de {c.monthName}</p>
                  </div>
                  {idx === 0 && <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Próximo</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feria' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-4 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-sm mb-4 border border-emerald-200 flex items-center gap-2">
              <Check className="w-5 h-5" /> {success}
            </div>
          )}

          {!isEditing && canEdit && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditingEventId(null);
                  setEditTitle('');
                  setEditDescription('');
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" /> Agregar Nuevo Evento
              </button>
            </div>
          )}

          {isEditing && canEdit ? (
            <form onSubmit={handleSaveFeria} className="glass-panel p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border shadow-xl">
              <h3 className="font-black text-xl text-slate-800 dark:text-white mb-6">
                {editingEventId ? 'Editar Evento' : 'Nuevo Evento de Feria del Libro'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-1">Título del Evento</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-300 rounded-2xl focus:ring-2 outline-none dark:bg-slate-800/50 dark:border-slate-700 dark:text-white"
                    placeholder="Ej. Feria Internacional del Libro Monterrey 2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-1">Descripción</label>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 pb-12">
                    <ReactQuill 
                      theme="snow" 
                      value={editDescription} 
                      onChange={setEditDescription} 
                      className="h-64 dark:text-white border-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mt-12 mb-1">Imagen de Portada</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 relative group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Selecciona o arrastra una imagen</p>
                  </div>
                </div>

                {previewUrl && (
                  <div className="h-48 w-full rounded-2xl overflow-hidden border">
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-6">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm">Cancelar</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2">
                  {loading ? 'Guardando...' : 'Guardar Evento'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-white/50 rounded-3xl border border-slate-200">
                  <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-bold">No hay eventos registrados</p>
                </div>
              ) : (
                events.map(event => (
                  <div key={event._id} className="glass-panel p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 shadow-lg flex flex-col h-full">
                    {event.image ? (
                      <div className="w-full h-48 rounded-2xl overflow-hidden border shadow-sm mb-4 shrink-0">
                        <img src={`${API_URL}/uploads/${event.image}`} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-48 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shrink-0">
                        <CalendarIcon className="w-10 h-10" />
                      </div>
                    )}
                    
                    <h3 className="font-black text-xl text-slate-800 dark:text-white mb-3">{event.title}</h3>
                    
                    {/* Render rich text HTML properly */}
                    <div className="text-slate-600 dark:text-slate-400 text-sm flex-grow mb-4 prose dark:prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: event.description }} />
                    
                    {canEdit && (
                      <div className="flex gap-2 pt-4 border-t mt-auto">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditingEventId(event._id);
                            setEditTitle(event.title);
                            setEditDescription(event.description);
                            setPreviewUrl(event.image ? `${API_URL}/uploads/${event.image}` : '');
                          }}
                          className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs transition"
                        >
                          <Edit className="w-4 h-4" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs transition"
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Eventos;
