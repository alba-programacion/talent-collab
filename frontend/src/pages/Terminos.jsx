import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Server, Briefcase, FileCheck, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '../App';

const Terminos = () => {
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
              <Scale className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Términos y Condiciones de Uso
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Plataforma de Intercambio y Colaboración de Talento Bursátil AMIB
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Vigente a partir de: Septiembre de 2026 | Asociación Mexicana de Instituciones Bursátiles, A.C.
          </p>
        </div>

        <div className="space-y-8 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          
          {/* 1. Objeto y Naturaleza */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">1</span>
              Objeto y Ámbito de Aplicación
            </h2>
            <p>
              Los presentes Términos y Condiciones regulan el acceso, navegación y uso de la <strong>Plataforma de Intercambio y Colaboración de Talento Bursátil</strong>, desarrollada y administrada por la <strong>Asociación Mexicana de Instituciones Bursátiles, A.C. (AMIB)</strong>. 
            </p>
            <p>
              La Plataforma constituye un ecosistema tecnológico para la vinculación laboral gremial, cuyo propósito es facilitar a las Casas de Bolsa, Operadoras y Distribuidoras de Fondos de Inversión, Instituciones Bancarias y entidades asociadas o vinculadas al sector financiero, el intercambio colaborativo de vacantes laborales y perfiles profesionales certificados.
            </p>
          </section>

          {/* 2. Infraestructura y Servidores AMIB */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">2</span>
              Infraestructura Institucional y Seguridad de los Servidores
            </h2>
            <p>
              El sistema, su código fuente, las bases de datos transaccionales y el repositorio de expedientes y currícula operan y se encuentran alojados exclusivamente en la <strong>infraestructura tecnológica y servidores administrados por la AMIB</strong>.
            </p>
            <p>
              La AMIB dispone de controles de seguridad perimetral, mecanismos de autenticación y registros de auditoría (logs) para garantizar la continuidad operativa, salvaguardar la información contra incidentes cibernéticos y asegurar que los datos se mantengan bajo altos estándares de confidencialidad e integridad técnica.
            </p>
          </section>

          {/* 3. Cuentas y Responsabilidad de las Instituciones */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">3</span>
              Registro y Uso de Cuentas Institucionales
            </h2>
            <p>
              El registro y acceso a la Plataforma está reservado exclusivamente a instituciones autorizadas y a su personal facultado de Atracción de Talento y Recursos Humanos. Al registrarse, el usuario declara y conviene que:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>Cuenta con las facultades legales e institucionales suficientes para representar a su entidad.</li>
              <li>Toda información ingresada (datos de la institución, representantes y ofertas laborales) es veraz, legítima, completa y actualizada.</li>
              <li>Las credenciales de acceso (usuario y contraseña) son de carácter estrictamente personal e intransferible, siendo su exclusiva responsabilidad cualquier acción efectuada mediante su sesión.</li>
            </ul>
          </section>

          {/* 4. Tratamiento Ético y Custodia de Currícula (CVs) */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">4</span>
              Custodia y Tratamiento de Curriculums Vitae (CVs) de Candidatos
            </h2>
            <p>
              Considerando que los postulantes y titulares de los currículos no cuentan con una credencial de acceso directo a la Plataforma, las instituciones miembros asumen el compromiso expreso de velar por la debida custodia y tratamiento legal de dichos expedientes bajo las siguientes directrices:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li><strong>Legitimidad del origen:</strong> La institución que incorpore o postule un CV al sistema garantiza que cuenta con el conocimiento y consentimiento del candidato para someter su perfil a procesos de vinculación laboral interinstitucional.</li>
              <li><strong>Finalidad única y confidencialidad:</strong> Los currículos y datos de contacto de los candidatos únicamente podrán ser utilizados para fines de selección, reclutamiento y validación de competencias para vacantes activas.</li>
              <li><strong>Prohibición de comercialización y explotación:</strong> Queda terminantemente prohibida la venta, comercialización, cesión o facilitación de currículos a intermediarios no agremiados o para fines ajenos al reclutamiento profesional.</li>
            </ul>
          </section>

          {/* 5. Publicación de Vacantes y Convivencia */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">5</span>
              Condiciones para la Publicación de Vacantes
            </h2>
            <p>
              Toda vacante publicada por las instituciones miembros deberá reflejar oportunidades de empleo genuinas, competitivas y apegadas a la legislación laboral mexicana. Se prohíbe expresamente:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Publicar ofertas que contengan requisitos discriminatorios por motivos de género, raza, edad, religión, estado civil, orientación sexual u origen étnico.</li>
              <li>Requerir depósitos monetarios o cobros a los postulantes como requisito de contratación o evaluación.</li>
              <li>Publicar información engañosa respecto a funciones, compensación o condiciones generales del puesto.</li>
            </ul>
          </section>

          {/* 6. Conductas Prohibidas */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">6</span>
              Conductas Prohibidas y Seguridad Informática
            </h2>
            <p>Queda estrictamente prohibido a los usuarios:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>Implementar mecanismos automatizados (bots, scripts, crawlers o scrapers) para la extracción masiva de datos o currícula.</li>
              <li>Introducir virus, troyanos, código malicioso o vulnerar la seguridad lógica de los servidores de la AMIB.</li>
              <li>Suplantar la identidad de otra institución miembro o de cualquier colaborador registrado.</li>
            </ul>
          </section>

          {/* 7. Deslinde y Naturaleza Jurídica */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">7</span>
              Naturaleza del Servicio y Limitación de Responsabilidad
            </h2>
            <p>
              La AMIB actúa como proveedora de la plataforma tecnológica y facilitadora de la colaboración gremial bursátil. La AMIB no es agencia de empleo ni empleador directo de los candidatos postulados, por lo que:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
              <li>No garantiza la contratación efectiva de ningún candidato ni la exactitud de los datos curriculares declarados por los postulantes.</li>
              <li>La decisión final de contratación y las relaciones laborales resultantes corresponden con exclusividad a la institución contratante y al postulante.</li>
            </ul>
          </section>

          {/* 8. Contacto y Soporte */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-sm flex items-center justify-center font-bold">8</span>
              Contacto y Soporte Institucional
            </h2>
            <p className="text-sm sm:text-base">
              Para dudas sobre la aplicación de estos Términos y Condiciones, aclaraciones técnicas o reportes sobre el uso de la Plataforma, favor de comunicarse con la coordinación de soporte de la AMIB a través del correo: <strong>soporte.talento@amib.com.mx</strong>.
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>© {new Date().getFullYear()} Asociación Mexicana de Instituciones Bursátiles, A.C.</span>
          <Link to="/privacidad" className="text-blue-600 dark:text-blue-400 hover:underline">
            Consultar Aviso de Privacidad
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
