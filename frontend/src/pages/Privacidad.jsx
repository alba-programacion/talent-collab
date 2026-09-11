import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../App';

const Privacidad = () => {
  const { theme } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 sm:p-12 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
        <Link to="/register" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al registro
        </Link>
        
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 mb-8">
          Aviso de Privacidad
        </h1>

        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">1. Identidad y Domicilio del Responsable</h2>
            <p>El Sistema de Intercambio AMIB es el responsable del uso y protección de sus datos personales, en estricto apego a la legislación aplicable en materia de protección de datos.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">2. Datos Personales Recabados</h2>
            <p>Para las finalidades señaladas en el presente aviso de privacidad, recabaremos los siguientes datos personales al momento de su registro como institución:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Nombre completo del representante o contacto de la institución.</li>
              <li>Correo electrónico institucional o de contacto.</li>
              <li>Nombre y perfil/giro de la institución a la que representa.</li>
            </ul>
            <p className="mt-2 text-sm italic">* Hacemos de su conocimiento que no recabamos datos personales sensibles, ni datos directos de candidatos (como currículums con información personal sensible directa al sistema público general, salvo lo estrictamente necesario para la colaboración interinstitucional).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">3. Finalidades del Tratamiento de Datos</h2>
            <p>Los datos personales que recabamos de usted los utilizaremos para las siguientes finalidades primarias, que son necesarias para el servicio que solicita:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Verificar y confirmar su identidad como representante institucional.</li>
              <li>Crear, administrar y dar mantenimiento a su cuenta en la Plataforma.</li>
              <li>Facilitar la colaboración, comunicación y publicación de vacantes entre las instituciones afiliadas.</li>
              <li>Envío de notificaciones importantes sobre su cuenta y actualizaciones del sistema (incluyendo códigos de verificación).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">4. Transferencia de Datos</h2>
            <p>Sus datos personales (nombre de la institución y perfil) podrán ser visibles para otras instituciones registradas en la Plataforma con el fin de facilitar la colaboración. No transferiremos su información personal a terceros no autorizados sin su previo consentimiento, salvo las excepciones previstas en la ley.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">5. Derechos ARCO</h2>
            <p>Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Para el ejercicio de cualquiera de los derechos ARCO, deberá enviar una solicitud a la administración de AMIB.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">6. Cambios al Aviso de Privacidad</h2>
            <p>El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones. Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir este aviso de privacidad, a través de notificaciones en la Plataforma o al correo electrónico registrado.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacidad;
