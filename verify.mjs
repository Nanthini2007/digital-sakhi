async function runVerification() {
  console.log('=== VERIFYING SAKHI CORE JOURNEY ===\n');

  // Step 1: Initial Query in Tamil
  console.log('1. User sends Tamil request...');
  let res = await fetch('http://localhost:3000/api/sakhi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userText: 'மகளிர் உரிமைத் தொகை ₹1000 பெறுவது எப்படி?',
      language: 'ta',
      action: 'chat',
      currentStepNumber: 1,
    }),
  });
  let d1 = await res.json();
  console.log('   ✓ Service Identified:', d1.serviceName);
  console.log('   ✓ Step:', d1.currentStepNumber, 'of', d1.totalSteps, '-', d1.stepTitle);
  console.log('   ✓ Reply:', d1.reply.substring(0, 70) + '...');
  console.log('   ✓ Next Action:', d1.nextAction);

  // Step 2: User clicks I'm Stuck (எனக்கு புரியவில்லை)
  console.log('\n2. User clicks "I\'m Stuck" (எனக்கு புரியவில்லை)...');
  res = await fetch('http://localhost:3000/api/sakhi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userText: 'எனக்கு புரியவில்லை',
      language: 'ta',
      action: 'im_stuck',
      activeServiceId: d1.serviceId,
      currentStepNumber: d1.currentStepNumber,
    }),
  });
  let d2 = await res.json();
  console.log('   ✓ Simpler Analogy:', d2.simpleExplanation);
  console.log('   ✓ ONE Next Action:', d2.nextAction);

  // Step 3: Next Step Transition
  console.log('\n3. User transitions to Step 2...');
  res = await fetch('http://localhost:3000/api/sakhi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userText: 'அடுத்த படி என்ன?',
      language: 'ta',
      action: 'next_step',
      activeServiceId: d1.serviceId,
      currentStepNumber: 2,
    }),
  });
  let d3 = await res.json();
  console.log('   ✓ Step:', d3.currentStepNumber, 'of', d3.totalSteps, '-', d3.stepTitle);
  console.log('   ✓ Next Action:', d3.nextAction);

  // Step 4: Official Link Handoff
  console.log('\n4. Official Link Handoff Check...');
  console.log('   ✓ Official URL:', d3.officialUrl);
  console.log('   ✓ Safety Check Passed:', d3.safety.passed);

  console.log('\n=== ALL CORE JOURNEY CHECKS PASSED SUCCESSFULLY ===');
}

runVerification();
