const mongoose = require('mongoose');
const Contact = require('../models/Contact'); // Adjust path as necessary, the script will be in backend/scripts
require('dotenv').config({ path: '../.env' }); // Adjust path

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-collab';

const contacts = [
  {
    institutionName: 'ACTINVER',
    titular: 'Aaron Alberto Juarez Pascual',
    titularEmail: 'ajuarezp@actinver.com.mx',
    titularPhone: '5530390495',
  },
  {
    institutionName: 'AMIB RH',
    titular: 'Ana Rovelo',
    titularEmail: 'arovelo@amib.com.mx',
  },
  {
    institutionName: 'BANREGIO',
    titular: 'Jonathan Adrian Mendez Guzman',
    titularEmail: 'jonathan.mendez@banregio.com',
    suplente: 'Fátima Vanessa Espinosa Quintana'
  },
  {
    institutionName: 'BOLSA MEXICANA DE VALORES',
    titular: 'Nancy Vazquez Angoa',
    titularEmail: 'nvazquez@grupobmv.com.mx',
  },
  {
    institutionName: 'BURSAMETRICA',
    titular: 'Leslie Soria Arellano',
    titularEmail: 'lsoria@bcbcasadebolsa.com',
    titularPhone: '5591988328',
    suplente: 'Bianca Mercado Ortega',
    suplenteEmail: 'bmercado@bcbcasadebolsa.com'
  },
  {
    institutionName: 'CONSUBANCO',
    titular: 'Héctor Mauricio Guzmán López',
    titularEmail: 'hguzman@consubanco.com',
    titularPhone: '5549494244'
  },
  {
    institutionName: 'EBC (CAMPUS CDMX)',
    titular: 'Monyshel Olivo',
    titularEmail: 'm.olivo@ebc.edu.mx',
    titularPhone: '5510152735',
    suplente: 'Juan José Revilla',
    suplenteEmail: 'j.revilla001@ebc.edu.mx',
    suplentePhone: '5540703575'
  },
  {
    institutionName: 'EBC (CAMPUS TLALNEPANTLA)',
    titular: 'Michelle Denisse Millares Avila',
    titularEmail: 'md.millares@ebc.edu.mx',
    titularPhone: '55 43 88 65 36',
    suplente: 'Axl Salmeron',
    suplenteEmail: 'a.salmeron@ebc.edu.mx',
    suplentePhone: '55 74 75 00 22'
  },
  {
    institutionName: 'FINAMEX',
    titular: 'Jesús Rafael Rodríguez Sánchez',
    titularEmail: 'jrodriguez@finamex.com.mx'
  },
  {
    institutionName: 'INVEX',
    titular: 'Pendiente',
    suplente: 'Alejandra Gutiérrez Rios',
    suplenteEmail: 'agutierrezr@invex.com'
  },
  {
    institutionName: 'MASARI (1)',
    titular: 'Claudia Vertiz Hernández',
    titularEmail: 'claudia.vertiz@masari.mx',
    suplente: 'Valeria Molina',
    suplenteEmail: 'Valeria.Molina@masari.mx'
  },
  {
    institutionName: 'MASARI (2)',
    titular: 'Orquidea Tafoya',
    titularEmail: 'Orquidea.Tafoya@masari.mx',
    suplente: 'Melissa Donaji Escamilla castro',
    suplenteEmail: 'melissa.escamilla@masari.mx'
  },
  {
    institutionName: 'MONEX',
    titular: 'Yuliett Reyes',
    titularEmail: 'yreyesz@monex.com.mx',
    titularPhone: '5631875195',
    suplente: 'Verónica González',
    suplenteEmail: 'vgonzalez@monex.com.mx'
  },
  {
    institutionName: 'SURA (1)',
    titular: 'Vania Yoselyn Villegas González',
    titularEmail: 'vania.villegas@suramexico.com',
    titularPhone: '5525696316',
    suplente: 'Karla Elizabeth Cabrera Guzmán',
    suplenteEmail: 'karla.cabrera@suramexico.com'
  },
  {
    institutionName: 'SURA (2)',
    titular: 'Atziri Victoria García',
    titularEmail: 'Atziri.Victoria@surainvestments.com',
    titularPhone: '56-14-29-67-97',
    suplente: 'Ana Maria Ramos Torres',
    suplenteEmail: 'Ana.Ramos@surainvestments.com'
  },
  {
    institutionName: 'TEC DE MONTERREY (CAMPUS CDMX)',
    titular: 'Gabriela Cruz Valdéz',
    titularEmail: 'cruzgab@tec.mx',
    suplente: 'Ivana Panich Podvezanec',
    suplenteEmail: 'ivana.panic@tec.mx'
  },
  {
    institutionName: 'UNIVERSIDAD ANÁHUAC DEL SUR',
    titular: 'Katia Toxtli Hernández',
    titularEmail: 'katia.toxtli@anahuac.mx',
    titularPhone: '55 3918 5503',
    suplente: 'Daniela Morales',
    suplentePhone: '55 6061 7450'
  },
  {
    institutionName: 'UNIVERSIDAD PANAMERICANA',
    titular: 'Irene Griñán Rivera',
    titularEmail: 'igrinan@up.edu.mx',
    titularPhone: '5529654506',
    suplente: 'Jimena Rojas',
    suplenteEmail: 'jrojas@up.edu.mx'
  },
  {
    institutionName: 'VALORES MEXICANOS',
    titular: 'Abigail Victoria',
    titularEmail: 'avictoria@valmex.com.mx',
    suplente: 'Alejandra Lamas Moreno',
    suplenteEmail: 'alamas@valmex.com.mx'
  },
  {
    institutionName: 'VE POR MAS',
    titular: 'Adrián Mirazo Cornejo',
    titularEmail: 'amirazo@vepormas.com',
    suplente: 'Erika López Díaz',
    suplenteEmail: 'elopezd@vepormas.com'
  },
  {
    institutionName: 'VIFARU',
    titular: 'Lucina Del Pozo Gómez',
    titularEmail: 'lucina.delpozo@vifaru.mx',
    titularPhone: '5525703656'
  },
  {
    institutionName: 'AMIB (COORDINACIÓN) (1)',
    titular: 'Alejandra Rosas Grijalva',
    titularEmail: 'arosas@amib.com.mx',
    titularPhone: '6622041833',
    suplente: 'Diana Paulina Hernández Gutiérrez',
    suplenteEmail: 'dhernandez@amib.com.mx'
  },
  {
    institutionName: 'AMIB (COORDINACIÓN) (2)',
    titular: 'Alejandra Rosas Grijalva',
    titularEmail: 'arosas@amib.com.mx',
    titularPhone: '6622041833',
    suplente: 'Rocio Garrido Rojas',
    suplenteEmail: 'rgarrido@amib.com.mx'
  }
];

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    // Ensure missing required fields like titularPhone are filled to bypass mongoose validation if any
    const formattedContacts = contacts.map(c => ({
      ...c,
      titular: c.titular || 'Pendiente',
      titularEmail: c.titularEmail || 'N/A',
      titularPhone: c.titularPhone || 'N/A'
    }));
    await Contact.insertMany(formattedContacts);
    console.log(`Inserted ${formattedContacts.length} contacts successfully.`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to DB:', err);
  });
