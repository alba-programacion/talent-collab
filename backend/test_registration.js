const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testRegistration() {
  const url = 'http://localhost:5000/api/cvs/vacancy';
  const formData = new FormData();
  formData.append('name', 'Test Candidate');
  formData.append('email', 'test@example.com');
  formData.append('targetVacancyId', '60d5ec0c1f2a3a0015f8e5f1'); // Example ID
  formData.append('sourceInstitutionId', 'A'); // Mock Institution A
  
  // Create dummy PDF
  const filePath = path.join(__dirname, 'dummy.pdf');
  fs.writeFileSync(filePath, 'Dummy PDF content');
  formData.append('document', fs.createReadStream(filePath));

  try {
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders(),
    });
    console.log('✅ Status:', response.status);
    console.log('✅ Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('❌ Status:', error.response.status);
      console.error('❌ Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

testRegistration();
