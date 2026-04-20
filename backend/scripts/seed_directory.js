require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const directoryData = [
  { institutionName: 'ACTINVER', titular: 'Aaron Alberto Juarez Pascual', titularEmail: 'aluarezp@actinver.com.mx', titularPhone: '5530390495' },
  { institutionName: 'AMIB RH', titular: 'Ana Rovelo', titularEmail: 'arovelo@amib.com.mx', titularPhone: 'S/N' },
  { institutionName: 'BANREGIO', titular: 'Jonathan Adrian Mendez Guzman', titularEmail: 'jonathan.mendez@banregio.com', titularPhone: 'S/N', suplente: 'Fátima Vanessa Espinosa Quintana', suplenteEmail: 'S/C', suplentePhone: 'S/N' },
  { institutionName: 'BOLSA MEXICANA DE VALORES', titular: 'Nancy Vazquez Angoa', titularEmail: 'nvazquez@grupobmv.com.mx', titularPhone: 'S/N' },
  { institutionName: 'BURSAMETRICA', titular: 'Leslie Soria Arellano', titularEmail: 'lsoria@bcbcasedebolsa.com', titularPhone: '5591988328', suplente: 'Bianca Mercado Ortega', suplenteEmail: 'bmercado@bcbcasedebolsa.com', suplentePhone: 'S/N' },
  { institutionName: 'CONSUBANCO', titular: 'Héctor Mauricio Guzmán López', titularEmail: 'hguzman@consubanco.com', titularPhone: '5549494244' },
  { institutionName: 'EBC (CAMPUS CDMX)', titular: 'Monlyshel Olivo', titularEmail: 'm.olivo@ebc.edu.mx', titularPhone: '5510152735', suplente: 'Juan José Revilla', suplenteEmail: 'jj.revilla001@ebc.edu.mx', suplentePhone: '5540703575' },
  { institutionName: 'EBC (CAMPUS TLALNEPANTLA)', titular: 'Michelle Denisse Millares Avila', titularEmail: 'md.millares@ebc.edu.mx', titularPhone: '5543888536', suplente: 'Axl Salmeron', suplenteEmail: 'aj.salmeron@ebc.edu.mx', suplentePhone: '5574750022' },
  { institutionName: 'FINAMEX', titular: 'Jesús Rafael Rodríguez Sánchez', titularEmail: 'jrodriguez@finamex.com.mx', titularPhone: 'S/N' },
  { institutionName: 'INVEX', titular: 'Pendiente', titularEmail: 'S/C', titularPhone: 'S/N', suplente: 'Alejandra Gutiérrez Rios', suplenteEmail: 'agutierrezr@invex.com', suplentePhone: 'S/N' },
  { institutionName: 'MASARI', titular: 'Claudia Vertiz Hernández', titularEmail: 'claudia.vertiz@masari.mx', titularPhone: 'S/N', suplente: 'Valeria Molina', suplenteEmail: 'Valeria.Molina@masari.mx', suplentePhone: 'S/N' },
  { institutionName: 'MASARI', titular: 'Orquidea Tafoya', titularEmail: 'Orquidea.Tafoya@masari.mx', titularPhone: 'S/N', suplente: 'Melissa Donají Escamilla castro', suplenteEmail: 'melissa.escamilla@masari.mx', suplentePhone: 'S/N' },
  { institutionName: 'MONEX', titular: 'Yuliet Reyes', titularEmail: 'yreyesz@monex.com.mx', titularPhone: '5631875195', suplente: 'Verónica González', suplenteEmail: 'vgonzalez@monex.com.mx', suplentePhone: 'S/N' },
  { institutionName: 'SURA', titular: 'Vania Yoselyn Villegas González', titularEmail: 'vania.villegas@suramexico.com', titularPhone: '5525696318', suplente: 'Karla Elizabeth Cabrera Guzmán', suplenteEmail: 'karla.cabrera@suramexico.com', suplentePhone: 'S/N' },
  { institutionName: 'SURA', titular: 'Atziri Victoria García', titularEmail: 'Atziri.Victoria@surainvestments.com', titularPhone: '5614296797', suplente: 'Ana Maria Ramos Torres', suplenteEmail: 'Ana.Ramos@surainvestments.com', suplentePhone: 'S/N' },
  { institutionName: 'TEC DE MONTERREY (CAMPUS CDMX)', titular: 'Gabriela Cruz Valdéz', titularEmail: 'cruzgab@tec.mx', titularPhone: 'S/N', suplente: 'Ivana Panich Podvezanec', suplenteEmail: 'ivana.panic@tec.mx', suplentePhone: 'S/N' },
  { institutionName: 'UNIVERSIDAD ANÁHUAC DEL SUR', titular: 'Katia Toxtli Hernández', titularEmail: 'katia.toxtli@anahuac.mx', titularPhone: '5539185503', suplente: 'Daniela Morales', suplenteEmail: 'S/C', suplentePhone: '5560617450' },
  { institutionName: 'UNIVERSIDAD PANAMERICANA', titular: 'Irene Griñán Rivera', titularEmail: 'igrinan@up.edu.mx', titularPhone: '5529654506', suplente: 'Jimena Rojas', suplenteEmail: 'isrojas@up.edu.mx', suplentePhone: 'S/N' },
  { institutionName: 'VALORES MEXICANOS', titular: 'Abigail Victoria', titularEmail: 'avictoria@valmex.com.mx', titularPhone: 'S/N', suplente: 'Alejandra Lamas Moreno', suplenteEmail: 'alamas@valmex.com.mx', suplentePhone: 'S/N' },
  { institutionName: 'VE POR MAS', titular: 'Adrián Mirazo Cornejo', titularEmail: 'amirazo@vepormas.com', titularPhone: 'S/N', suplente: 'Erika López Díaz', suplenteEmail: 'elopezd@vepormas.com', suplentePhone: 'S/N' },
  { institutionName: 'VIFARU', titular: 'Lucina Del Pozo Gómez', titularEmail: 'lucina.delpozo@vifaru.mx', titularPhone: '5525703656' },
  { institutionName: 'AMIB (COORDINACIÓN)', titular: 'Alejandra Rosas Grijalva', titularEmail: 'arosas@amib.com.mx', titularPhone: '6622041833', suplente: 'Diana Paulina Hernández Gutiérrez', suplenteEmail: 'dhernandez@amib.com.mx', suplentePhone: 'S/N' },
  { institutionName: 'AMIB (COORDINACIÓN)', titular: 'Rocio Garrido Rojas', titularEmail: 'rgarrido@amib.com.mx', titularPhone: 'S/N', suplente: 'Diana Paulina Hernández Gutiérrez', suplenteEmail: 'dhernandez@amib.com.mx', suplentePhone: 'S/N' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-collab');
    console.log('Connected to MongoDB');

    // Optional: Clear existing directory to avoid duplicates if requested, 
    // but here we just append or use a criteria. 
    // Since this is a "populate" task, we might want to clean up if it's the first time.
    // await Contact.deleteMany({}); 

    await Contact.insertMany(directoryData);
    console.log(`Successfully seeded ${directoryData.length} contacts.`);

    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding directory:', err);
    process.exit(1);
  }
}

seed();
