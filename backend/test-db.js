require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talent-collab')
  .then(async () => {
    console.log('✅ Connected to MongoDB. Testing insert...');
    try {
      const user = new User({ name: 'Test', email: 'test' + Date.now() + '@test.com', password: '123' });
      await user.save();
      console.log('✅ Saved successfully.');
    } catch(err) {
      console.log('❌ Insert failed:', err.message);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Connection failed:', err.message);
    process.exit(1);
  });
