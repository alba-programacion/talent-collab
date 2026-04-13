const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-collab';

// Minimal schemas for deletion
const Vacancy = mongoose.model('Vacancy', new mongoose.Schema({}), 'vacancies');
const CV = mongoose.model('CV', new mongoose.Schema({}), 'cvs');
const Task = mongoose.model('Task', new mongoose.Schema({}), 'tasks');
const Contact = mongoose.model('Contact', new mongoose.Schema({}), 'contacts');

async function resetDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    console.log('Deleting Vacancies...');
    await Vacancy.deleteMany({});
    
    console.log('Deleting CVs...');
    await CV.deleteMany({});
    
    console.log('Deleting Tasks...');
    await Task.deleteMany({});
    
    console.log('Deleting Contacts (Directorio)...');
    await Contact.deleteMany({});

    console.log('\n✨ Database Hard Reset Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    process.exit(1);
  }
}

resetDB();
