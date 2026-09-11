import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../App';

const Terminos = () => {
  const { theme } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 sm:p-12 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
        <Link to="/register" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al registro
        </Link>
        
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 mb-8">
          Términos y Condiciones
        </h1>

        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">1. Aceptación de los Términos</h2>
            <p>Al acceder y registrarse en el Sistema de Intercambio AMIB (en adelante "la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá registrarse ni utilizar nuestros servicios.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">2. Registro de Instituciones</h2>
            <p>El acceso a la Plataforma está restringido a representantes autorizados de instituciones. Al registrarse, usted garantiza que:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Tiene la autoridad legal para vincular a su institución a estos términos.</li>
              <li>La información proporcionada (nombre de la institución, perfil y correo electrónico) es veraz, precisa y actual.</li>
              <li>Mantendrá la confidencialidad de sus credenciales de acceso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">3. Uso de la Plataforma</h2>
            <p>La Plataforma está diseñada para facilitar el intercambio y colaboración entre instituciones. Usted acepta no utilizar la Plataforma para:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Cualquier propósito ilegal o no autorizado.</li>
              <li>Transmitir cualquier código de naturaleza destructiva (virus, gusanos, etc.).</li>
              <li>Intentar obtener acceso no autorizado a los sistemas de la Plataforma o a cuentas de otras instituciones.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">4. Modificaciones del Servicio</h2>
            <p>Nos reservamos el derecho de modificar o discontinuar la Plataforma (o cualquier parte del contenido) en cualquier momento y sin previo aviso. No seremos responsables ante usted ni ante ningún tercero por ninguna modificación, suspensión o interrupción del servicio.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">5. Contacto</h2>
            <p>Para cualquier duda o aclaración sobre estos Términos y Condiciones, por favor contacte a la administración de AMIB.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
