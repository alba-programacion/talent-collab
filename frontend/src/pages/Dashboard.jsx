import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { Briefcase, Building, FileText, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ totalVacancies: 0, totalInstitutions: 0, totalCvs: 0, cvsInProcess: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(API_URL + '/api/metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (e) {
        console.error("Error fetching metrics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    // Actualización en tiempo real sugerida (polling simplificado)
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { title: 'Total Vacantes', value: metrics.totalVacancies, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Instituciones Red', value: metrics.totalInstitutions, icon: Building, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'CVs Totales', value: metrics.totalCvs, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'CVs en Proceso', value: metrics.cvsInProcess, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Control Global</h1>
          <p className="text-slate-500 dark:text-slate-400">Bienvenido de nuevo, {user?.role === 'admin' ? 'Administrador' : user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? <span className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-12 block rounded mt-1"></span> : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-panel p-6 rounded-2xl mt-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Actividad y Estatus</h3>
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium z-10">Módulo Analítico</p>
          <p className="text-xs text-slate-400 mt-2 z-10 max-w-sm text-center">Aquí se visualizarán las métricas de colaboración bilateral con gráficos interactivos una vez haya suficiente histórico de datos.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
