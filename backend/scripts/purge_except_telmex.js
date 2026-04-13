const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-collab';

// Minimal schemas for deletion
const Institution = mongoose.model('Institution', new mongoose.Schema({ _id: String }), 'institutions');
const User = mongoose.model('User', new mongoose.Schema({ institutionId: String, email: String }), 'users');
const Vacancy = mongoose.model('Vacancy', new mongoose.Schema({}), 'vacancies');
const CV = mongoose.model('CV', new mongoose.Schema({}), 'cvs');
const Task = mongoose.model('Task', new mongoose.Schema({}), 'tasks');
const Contact = mongoose.model('Contact', new mongoose.Schema({}), 'contacts');

const TELMEX_ID = 'TELM245';
const SYSTEM_ADMIN = 'admin@system.com';

async function purgeDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    console.log(`Preserving Institution: ${TELMEX_ID}...`);
    
    // Deletions
    console.log('Purging other Institutions...');
    const instResult = await Institution.deleteMany({ _id: { $ne: TELMEX_ID } });
    console.log(`   Deleted ${instResult.deletedCount} institutions.`);

    console.log('Purging other Users...');
    const userResult = await User.deleteMany({ 
      $and: [
        { institutionId: { $ne: TELMEX_ID } },
        { email: { $ne: SYSTEM_ADMIN } }
      ]
    });
    console.log(`   Deleted ${userResult.deletedCount} users.`);

    console.log('Purging all transactional documents (Vacancies, CVs, Tasks, Contacts)...');
    await Vacancy.deleteMany({});
    await CV.deleteMany({});
    await Task.deleteMany({});
    await Contact.deleteMany({});

    console.log('\n✨ Database Selective Purge (TELMEX Only) Completed Successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database purge:', error);
    process.exit(1);
  }
}

purgeDB();
