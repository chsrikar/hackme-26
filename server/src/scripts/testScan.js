import { signPassToken } from '../utils/jwt.js';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';

async function runTests() {
  console.log('🧪 Starting QR Scan-to-Database Automated Validation Suite...\n');

  // Test 1: Generate signed Base Attendance Token for Jinadev M Jijoy (HACK-16A)
  console.log('--- TEST 1: First Attendance Scan ---');
  const baseToken = signPassToken({
    rollNumber: 'HACK-16A',
    name: 'Jinadev M Jijoy',
    team: 'Team Zenith',
    type: 'base'
  }, '24h');

  console.log('Generated signed JWT:', baseToken.slice(0, 30) + '...');

  const scanRes1 = await fetch(`${SERVER_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrToken: baseToken })
  });

  const scanData1 = await scanRes1.json();
  console.log(`Status: ${scanRes1.status}`);
  console.log('Response:', scanData1);

  if (scanRes1.status !== 200 && scanRes1.status !== 409) {
    throw new Error(`Test 1 Failed with status ${scanRes1.status}`);
  }
  console.log('✅ Test 1 Passed: Base scan handled correctly.\n');

  // Test 2: Duplicate Attendance Scan (Must return 409 ALREADY_MARKED)
  console.log('--- TEST 2: Duplicate Attendance Scan ---');
  const scanRes2 = await fetch(`${SERVER_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrToken: baseToken })
  });

  const scanData2 = await scanRes2.json();
  console.log(`Status: ${scanRes2.status}`);
  console.log('Response:', scanData2);

  if (scanRes2.status !== 409) {
    throw new Error(`Test 2 Failed: Expected 409 ALREADY_MARKED, got ${scanRes2.status}`);
  }
  console.log('✅ Test 2 Passed: Duplicate scan returned 409 ALREADY_MARKED.\n');

  // Test 3: Request Movement Pass (Washroom)
  console.log('--- TEST 3: Issue Movement Pass & Generate Signed QR Token ---');
  // Look up participantId for HACK-16A
  const partsRes = await fetch(`${SERVER_URL}/api/participants?team=Team%20Zenith`);
  const parts = await partsRes.json();
  const jinadev = parts.find((p) => p.rollNumber === 'HACK-16A');

  if (!jinadev) {
    throw new Error('Could not find participant HACK-16A in database');
  }

  const passReqRes = await fetch(`${SERVER_URL}/api/passes/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      participantId: jinadev.id,
      passType: 'washroom',
      reason: 'Automated test washroom pass'
    })
  });

  const passReqData = await passReqRes.json();
  console.log(`Status: ${passReqRes.status}`);
  console.log('Pass Issued:', passReqData.pass?.id, 'Type:', passReqData.pass?.passType);
  console.log('Signed Pass QR Token:', passReqData.qrToken?.slice(0, 30) + '...');

  if (passReqRes.status !== 201) {
    throw new Error(`Test 3 Failed: ${JSON.stringify(passReqData)}`);
  }
  console.log('✅ Test 3 Passed: Movement pass created and signed QR token issued.\n');

  // Test 4: Scan Movement Pass Return
  console.log('--- TEST 4: Movement Pass Return Scan ---');
  const returnRes = await fetch(`${SERVER_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrToken: passReqData.qrToken })
  });

  const returnData = await returnRes.json();
  console.log(`Status: ${returnRes.status}`);
  console.log('Response:', returnData);

  if (returnRes.status !== 200 || returnData.type !== 'pass_returned') {
    throw new Error(`Test 4 Failed: Expected 200 pass_returned, got ${returnRes.status}`);
  }
  console.log('✅ Test 4 Passed: Movement pass return processed and duration calculated.\n');

  // Test 5: Scan Inactive/Returned Pass Again (Must return 400 PASS_NOT_ACTIVE)
  console.log('--- TEST 5: Return Already-Closed Pass ---');
  const inactiveRes = await fetch(`${SERVER_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrToken: passReqData.qrToken })
  });

  const inactiveData = await inactiveRes.json();
  console.log(`Status: ${inactiveRes.status}`);
  console.log('Response:', inactiveData);

  if (inactiveRes.status !== 400 || inactiveData.code !== 'PASS_NOT_ACTIVE') {
    throw new Error(`Test 5 Failed: Expected 400 PASS_NOT_ACTIVE, got ${inactiveRes.status}`);
  }
  console.log('✅ Test 5 Passed: Closed pass correctly rejected with PASS_NOT_ACTIVE.\n');

  // Test 6: Malformed / Untrusted Token
  console.log('--- TEST 6: Untrusted / Tampered Token ---');
  const badRes = await fetch(`${SERVER_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrToken: 'fake.jwt.token.untrusted' })
  });

  const badData = await badRes.json();
  console.log(`Status: ${badRes.status}`);
  console.log('Response:', badData);

  if (badRes.status !== 400 || badData.code !== 'INVALID_QR') {
    throw new Error(`Test 6 Failed: Expected 400 INVALID_QR, got ${badRes.status}`);
  }
  console.log('✅ Test 6 Passed: Tampered QR rejected with INVALID_QR.\n');

  console.log('🎉 ALL 6 QR SCAN & DATABASE TESTS PASSED PERFECTLY!');
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
