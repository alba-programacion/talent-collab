import React from 'react';
import { Book } from 'lucide-react';

const Directorio = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Book className="w-8 h-8 text-blue-500" />
            Directorio Institucional
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Encuentra contactos y dependencias clave dentro de la red colaborativa.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center justify-center">
         <Book className="w-16 h-16 text-slate-200 dark:text-slate-700 mb-4" />
         <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Módulo en Construcción</h3>
         <p className="text-slate-500 max-w-md">El directorio interactivo con perfiles y contactos de las instituciones asociadas estará disponible próximamente en futuras actualizaciones.</p>
      </div>
    </div>
  );
};

export default Directorio;
