import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [institutionId, setInstitutionId] = useState('');
  const [newInstitutionName, setNewInstitutionName] = useState('');
  const [newInstitutionProfile, setNewInstitutionProfile] = useState('');
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/api/institutions')
      .then(res => res.json())
      .then(data => setInstitutions(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!institutionId) {
        setLoading(false);
        return setError('Selecciona o crea una institución aportadora.');
      }
      if (institutionId === 'NEW' && (!newInstitutionName || !newInstitutionProfile)) {
        setLoading(false);
        return setError('Ingresa el nombre y el tipo de la nueva institución.');
      }
      
      const payload = {
        name, email, password, role,
        institutionId: institutionId === 'NEW' ? null : institutionId,
        newInstitutionName: institutionId === 'NEW' ? newInstitutionName : undefined,
        newInstitutionProfile: institutionId === 'NEW' ? newInstitutionProfile : undefined
      };

      const res = await fetch(API_URL + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Error al registrar.');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="glass-panel max-w-md w-full p-8 rounded-3xl animate-fade-in shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 mb-2">TalentCollab</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Crear cuenta nueva</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol a registrar</label>
            <select 
              value={role} 
              onChange={e => {
                setRole(e.target.value);
                if (e.target.value === 'user' && institutionId === 'NEW') setInstitutionId('');
              }}
              className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
            >
              <option value="user">Usuario Reclutador (Estándar)</option>
              <option value="management">Gerente / Coordinador</option>
              <option value="admin">Administrador Global del Sistema</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Institución a la que perteneces</label>
              <select 
                value={institutionId} 
                onChange={e => setInstitutionId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
              >
                <option value="">-- Selecciona una Institución --</option>
                {['admin', 'management'].includes(role) && (
                  <option value="NEW" className="font-bold text-indigo-600">➕ Crear Nueva Institución</option>
                )}
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name} ({inst.profile})</option>
                ))}
              </select>
            </div>

            {institutionId === 'NEW' && ['admin', 'management'].includes(role) && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 animate-fade-in space-y-3">
                <div>
                  <label className="block text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-1">Nombre Oficial</label>
                  <input 
                    type="text" 
                    value={newInstitutionName}
                    onChange={(e) => setNewInstitutionName(e.target.value)}
                    placeholder="Ej. Banco Nacional"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-1">Giro / Tipo de Institución</label>
                  <select 
                    value={newInstitutionProfile}
                    onChange={(e) => setNewInstitutionProfile(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                    required
                  >
                    <option value="">Seleccionar Giro</option>
                    <option value="Banco">Banco</option>
                    <option value="Casa de Bolsa">Casa de Bolsa</option>
                    <option value="Universidad">Universidad / Academia</option>
                    <option value="Empresa Privada">Empresa Privada</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
