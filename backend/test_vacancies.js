const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/vacancies');
    console.log('✅ Count:', res.data.length);
    console.log('✅ First:', res.data[0] ? res.data[0].role : 'None');
  } catch(e) {
    console.error('❌ Error:', e.response?.data || e.message);
  }
}
test();
