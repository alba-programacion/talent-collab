import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Database, FileText, UserCheck, Lock, Mail } from 'lucide-react';
import { useAuth } from '../App';

const Privacidad = () => {
  const { theme } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-10 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-12">
        <Link 
          to="/register" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al registro
        </Link>
        
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Aviso de Privacidad Integral
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Plataforma de Intercambio y Colaboración de Talento Bursátil AMIB
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Última actualización: Septiembre de 2026 | En apego a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)
          </p>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          
          {/* 1. Responsable */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">1</span>
              Identidad y Domicilio del Responsable
            </h2>
            <p>
              La <strong>Asociación Mexicana de Instituciones Bursátiles, A.C. (en lo sucesivo, "AMIB")</strong>, en su calidad de entidad coordinadora y facilitadora gremial, es la responsable del uso, resguardo y protección de los datos personales tratados a través de la presente Plataforma de Intercambio y Colaboración de Talento Bursátil, con apego a los principios de licitud, consentimiento, información, calidad, finalidad, lealtad, proporcionalidad y responsabilidad previstos en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.
            </p>
          </section>

          {/* 2. Infraestructura y Servidores AMIB */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">2</span>
              Infraestructura Tecnológica y Alojamiento Seguro
            </h2>
            <p>
              Hacemos de su conocimiento que la Plataforma, sus bases de datos, repositorios documentales y registros electrónicos operan y se encuentran alojados íntegramente en la <strong>infraestructura tecnológica y servidores corporativos de la AMIB</strong>. 
            </p>
            <p>
              La AMIB implementa rigurosas medidas de seguridad administrativas, técnicas y físicas orientadas a proteger la confidencialidad, integridad y disponibilidad de la información frente a accesos no autorizados, daño, pérdida, alteración o tratamiento no autorizado.
            </p>
          </section>

          {/* 3. Datos Personales Recabados */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">3</span>
              Categorías de Datos Personales Tratados
            </h2>
            <p>
              Para cumplir con los fines del servicio, la Plataforma distingue dos grupos de titulares cuyos datos son tratados:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Usuarios Institucionales y Representantes:</strong> Nombre completo, correo electrónico corporativo o institucional, cargo o departamento, institución miembro a la que representa y registros de auditoría de acceso al sistema.
              </li>
              <li>
                <strong>Titulares de Currícula Vitae (Candidatos):</strong> Datos de identificación (nombre completo), información de contacto profesional (teléfono, correo electrónico, entidad federativa), trayectoria y experiencia laboral, grado académico, certificaciones bursátiles otorgadas por la AMIB o instituciones afines, habilidades técnicas e idiomas contenidos en el archivo de currículum vitae.
              </li>
            </ul>
          </section>

          {/* 4. Tratamiento de Datos de Titulares de CVs sin Cuenta */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">4</span>
              Tratamiento de Datos Personales de Candidatos y Titulares de CVs
            </h2>
            <p>
              Aun cuando las personas titulares de los currículos no posean una cuenta de usuario directa en la Plataforma, sus datos personales gozan de la más estricta salvaguarda legal conforme a los siguientes lineamientos:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Legitimidad y Consentimiento en la Carga:</strong> Las instituciones miembros participantes garantizan que la incorporación de currículos al sistema se realiza con motivo de procesos de vinculación laboral previamente informados a los candidatos o bajo bases legítimas de postulación e intermediación.
              </li>
              <li>
                <strong>Finalidad Exclusiva de Selección:</strong> Los datos contenidos en los CVs son tratados de manera exclusiva para la evaluación de perfiles en vacantes profesionales dentro de las entidades financieras y bursátiles adscritas a la red colaborativa de la AMIB.
              </li>
              <li>
                <strong>Prohibición Estricta de Comercialización:</strong> La AMIB y las instituciones participantes tienen estrictamente prohibida la venta, cesión, explotación comercial o difusión pública de los datos de los candidatos a terceras personas no vinculadas con fines de reclutamiento gremial.
              </li>
            </ul>
          </section>

          {/* 5. Finalidades del Tratamiento */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">5</span>
              Finalidades del Tratamiento
            </h2>
            <p>Los datos personales son tratados para las siguientes finalidades primarias y necesarias:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Autenticar y gestionar las credenciales de los representantes de las instituciones participantes.</li>
              <li>Facilitar la intermediación y vinculación de perfiles laborales cualificados entre las entidades del sector bursátil y financiero agremiadas a la AMIB.</li>
              <li>Validar la vigencia de certificaciones profesionales oficiales emitidas por la AMIB respecto de los postulantes evaluados.</li>
              <li>Permitir la postulación, seguimiento y contacto profesional con candidatos idóneos para las vacantes registradas.</li>
              <li>Generar métricas cuantitativas y estadísticas agregadas del mercado laboral bursátil, mediante procedimientos de disociación que impiden la identificación individual de los titulares.</li>
            </ul>
          </section>

          {/* 6. Transferencia y Divulgación Controlada */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">6</span>
              Transferencia y Confidencialidad de la Información
            </h2>
            <p>
              La información contenida en la Plataforma se compartirá únicamente entre las entidades e instituciones bursátiles debidamente acreditadas y autenticadas, con el fin estricto de colaboración y contratación de talento profesional.
            </p>
            <p>
              La AMIB no efectuará transferencias de datos personales a terceros ajenos a la red institucional autorizada, salvo en los supuestos legalmente previstos por el artículo 37 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (tales como requerimientos fundados y motivados de autoridades administrativas o judiciales competentes, o cuando sea estrictamente necesario para la salvaguarda de un interés público).
            </p>
          </section>

          {/* 7. Ejercicio de Derechos ARCO */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">7</span>
              Ejercicio de Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
            </h2>
            <p>
              Tanto los usuarios institucionales como cualquier persona física titular de un currículum vitae alojado en la Plataforma tienen el derecho inalienable de ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición al tratamiento de sus datos personales, así como de revocar el consentimiento otorgado previamente.
            </p>
            <p className="text-sm sm:text-base">
              Para tramitar cualquier solicitud de derechos ARCO o solicitar la baja inmediata de un expediente curricular, el titular o su representante legal debidamente acreditado podrá comunicarse con el área de soporte y administración de datos de la AMIB a través del correo institucional: <strong>privacidad@amib.com.mx</strong>.
            </p>
          </section>

          {/* 8. Modificaciones */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">8</span>
              Actualizaciones del Aviso de Privacidad
            </h2>
            <p>
              La AMIB se reserva el derecho de actualizar o efectuar modificaciones al presente Aviso de Privacidad derivado de cambios normativos, mejoras en la infraestructura tecnológica o nuevas funcionalidades de la Plataforma. Las actualizaciones estarán permanentemente disponibles para consulta en este mismo apartado.
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>© {new Date().getFullYear()} Asociación Mexicana de Instituciones Bursátiles, A.C.</span>
          <Link to="/terminos" className="text-blue-600 dark:text-blue-400 hover:underline">
            Consultar Términos y Condiciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacidad;
