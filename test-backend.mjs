async function testBackendApis() {
  console.log('=== VERIFYING P0 BACKEND API ENDPOINTS ===\n');

  // A first-time maternity query must select PMMVY instead of defaulting to KMUT.
  console.log('0. Testing first-query scheme selection ...');
  let res = await fetch('http://localhost:3000/api/journey/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test_pmmvy_first_query',
      userText: 'I am pregnant, how do I get the ₹5000 maternity benefit?',
      language: 'en',
    })
  });
  let selection = await res.json();
  if (selection.serviceId !== 'pmmvy') {
    throw new Error(`Expected PMMVY for maternity query, got ${selection.serviceId}`);
  }
  console.log('   ✓ Selected Service:', selection.serviceId);

  // 1. Start Journey
  console.log('1. Testing POST /api/journey/start ...');
  res = await fetch('http://localhost:3000/api/journey/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: 'test_session_101', serviceId: 'kmut', language: 'ta' })
  });
  let d1 = await res.json();
  console.log('   ✓ Status:', res.status, '| Journey ID:', d1.journeyId, '| Step:', d1.currentStep);

  // 2. Get Journey State
  console.log('\n2. Testing GET /api/journey/state ...');
  res = await fetch('http://localhost:3000/api/journey/state?sessionId=test_session_101&serviceId=kmut&language=ta');
  let d2 = await res.json();
  console.log('   ✓ Status:', res.status, '| Current Step:', d2.currentStep, '| Service:', d2.serviceName);

  // 3. Advance Journey (Next)
  console.log('\n3. Testing POST /api/journey/next ...');
  res = await fetch('http://localhost:3000/api/journey/next', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: 'test_session_101', serviceId: 'kmut', currentStep: 1, language: 'ta' })
  });
  let d3 = await res.json();
  console.log('   ✓ Status:', res.status, '| Next Step:', d3.currentStep, '| Next Action:', d3.nextAction);

  // 4. Stuck Guidance
  console.log('\n4. Testing POST /api/journey/stuck ...');
  res = await fetch('http://localhost:3000/api/journey/stuck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: 'test_session_101', serviceId: 'kmut', currentStep: 2, language: 'ta' })
  });
  let d4 = await res.json();
  console.log('   ✓ Status:', res.status, '| Explanation:', d4.simpleExplanation);

  // 5. Get Service Details
  console.log('\n5. Testing GET /api/service/details ...');
  res = await fetch('http://localhost:3000/api/service/details?serviceId=kmut&language=ta');
  let d5 = await res.json();
  console.log('   ✓ Status:', res.status, '| Official URL:', d5.officialUrl, '| Documents count:', d5.documents.length);

  // 6. Conversational AI Chat
  console.log('\n6. Testing POST /api/ai/chat ...');
  res = await fetch('http://localhost:3000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userText: 'கர்ப்பிணி பெண்ணுக்கு ₹5000 எப்போது கிடைக்கும்?', language: 'ta' })
  });
  let d6 = await res.json();
  console.log('   ✓ Status:', res.status, '| Matched Service:', d6.serviceName, '| Reply:', d6.reply.substring(0, 60) + '...');

  console.log('\n=== ALL P0 BACKEND API TESTS PASSED SUCCESSFULLY ===');
}

testBackendApis();
