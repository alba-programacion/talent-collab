const fetch = require('node-fetch');

async function testSla() {
  try {
    // 1. Get an existing vacancy ID
    const vacRes = await fetch('http://localhost:5000/api/vacancies');
    const vacancies = await vacRes.json();
    if (!vacancies.length) {
      console.log("No vacancies found to test.");
      return;
    }
    const targetVacancyId = vacancies[0].id;
    console.log("Testing with vacancy:", targetVacancyId);

    // 2. Submit SLA request
    const res = await fetch('http://localhost:5000/api/tasks/request-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetVacancyId,
        senderInstitutionId: 'A',
        targetEmail: 'test@target.com',
        description: 'Test SLA Request',
        dueDate: new Date(Date.now() + 86400000).toISOString()
      })
    });
    
    const data = await res.json();
    console.log("Response:", res.status, data);
    
    if (res.ok) {
       console.log("SLA Request SUCCESS");
    } else {
       console.log("SLA Request FAILED");
    }
  } catch (e) {
    console.error("Test Error:", e);
  }
}

testSla();
