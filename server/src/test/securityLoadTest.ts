import axios from 'axios';
import { io as socketClient } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_BASE = 'http://localhost:5000';

async function runSecurityAndLoadTests() {
  console.log('===========================================================');
  console.log('🛡️  RISHTA24 SECURITY, PRIVACY & 100-USER LOAD TEST SUITE');
  console.log('===========================================================\n');

  // --- STEP 1: AUTHENTICATION & TOKEN ACQUISITION ---
  console.log('--- 1. Authenticating Test Accounts ---');
  let tokenA = '', userAId = '';
  let tokenB = '', userBId = '';

  const userAData = {
    email: 'userA@test.local',
    phone: '9876543210',
    password: 'Password123!',
    firstName: 'Aarav',
    lastName: 'Sharma',
    gender: 'MALE',
    dateOfBirth: '1995-05-15',
    motherTongue: 'Hindi',
    religion: 'Hindu',
    community: 'Brahmin',
    city: 'Mumbai',
    state: 'Maharashtra',
    educationLevel: 'Master',
    degree: 'M.Tech Computer Science',
    occupation: 'Software Architect',
  };

  const userBData = {
    email: 'userB@test.local',
    phone: '9876543211',
    password: 'Password123!',
    firstName: 'Ananya',
    lastName: 'Iyer',
    gender: 'FEMALE',
    dateOfBirth: '1997-08-20',
    motherTongue: 'Tamil',
    religion: 'Hindu',
    community: 'Iyer',
    city: 'Bengaluru',
    state: 'Karnataka',
    educationLevel: 'Master',
    degree: 'MBA Finance',
    occupation: 'Investment Banker',
  };

  try {
    const resA = await axios.post(`${API_BASE}/auth/register`, userAData);
    tokenA = resA.data.data.accessToken;
    userAId = resA.data.data.user.id;
  } catch (err: any) {
    const loginA = await axios.post(`${API_BASE}/auth/login`, { identifier: 'userA@test.local', password: 'Password123!' });
    tokenA = loginA.data.data.accessToken;
    userAId = loginA.data.data.user.id;
  }

  try {
    const resB = await axios.post(`${API_BASE}/auth/register`, userBData);
    tokenB = resB.data.data.accessToken;
    userBId = resB.data.data.user.id;
  } catch (err: any) {
    const loginB = await axios.post(`${API_BASE}/auth/login`, { identifier: 'userB@test.local', password: 'Password123!' });
    tokenB = loginB.data.data.accessToken;
    userBId = loginB.data.data.user.id;
  }

  console.log(`✅ Authenticated User A (${userAId}) & User B (${userBId})\n`);

  // --- TEST 1: MASS ASSIGNMENT PROTECTION ---
  console.log('--- TEST 1: Mass Assignment Prevention Test ---');
  await axios.put(
    `${API_BASE}/profiles/me`,
    {
      city: 'Pune',
      isPremium: true,
      role: 'SUPER_ADMIN',
      verificationBadge: true,
    },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );

  const meCheck = await axios.get(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });

  const massAssignPassed =
    meCheck.data.data.user.role === 'USER' &&
    meCheck.data.data.profile.isPremium === false;

  console.log(
    massAssignPassed
      ? '✅ PASS: Mass Assignment Protection verified! Privileged fields ignored.'
      : '❌ FAIL: Mass Assignment Vulnerability Detected!'
  );

  // --- TEST 2: BROKEN FUNCTION LEVEL AUTHORIZATION (BFLA) ---
  console.log('\n--- TEST 2: Admin Endpoint BFLA Authorization Test ---');
  let bflaPassed = false;
  try {
    await axios.get(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    console.log('❌ FAIL: Regular user accessed admin endpoint!');
  } catch (err: any) {
    if (err.response?.status === 403) {
      bflaPassed = true;
      console.log('✅ PASS: BFLA Protection verified! Regular user blocked with 403 Forbidden.');
    }
  }

  // --- TEST 3: SOCKET.IO ROOM HIJACKING PREVENTION ---
  console.log('\n--- TEST 3: Socket.IO Room Hijacking Prevention Test ---');
  const socketA = socketClient(SOCKET_BASE, { auth: { token: tokenA } });

  const socketPassed = await new Promise<boolean>((resolve) => {
    socketA.on('socket_error', (data: any) => {
      if (data.message.includes('Unauthorized') || data.message.includes('Invalid')) {
        socketA.disconnect();
        resolve(true);
      }
    });

    const triggerJoin = () => {
      socketA.emit('join_conversation', '666666666666666666666666');
    };

    if (socketA.connected) {
      triggerJoin();
    } else {
      socketA.on('connect', triggerJoin);
    }

    setTimeout(() => {
      socketA.disconnect();
      resolve(false);
    }, 4000);
  });

  console.log(
    socketPassed
      ? '✅ PASS: Socket.IO Room Hijack blocked! Unauthorized room join denied.'
      : '❌ FAIL: Socket room hijack vulnerability detected!'
  );

  // --- TEST 4: CONTACT PRIVACY & DATA ISOLATION ---
  console.log('\n--- TEST 4: Contact Privacy & Data Isolation Test ---');
  // Set User B's phone visibility to PRIVATE
  await axios.put(
    `${API_BASE}/profiles/me`,
    { privacySettings: { phoneVisibility: 'PRIVATE' } },
    { headers: { Authorization: `Bearer ${tokenB}` } }
  );

  const viewB = await axios.get(`${API_BASE}/profiles/${userBId}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });

  const privacyPassed = viewB.data.data.profile.user.phone === undefined;
  console.log(
    privacyPassed
      ? '✅ PASS: Data Isolation & Privacy filtering verified! Private phone withheld.'
      : '❌ FAIL: Private contact info leaked!'
  );

  // --- TEST 5: 100 CONCURRENT USERS LOAD TEST ---
  console.log('\n--- TEST 5: 100 Concurrent Users Benchmark Load Test ---');
  const CONCURRENT_USERS = 100;
  const requests: Promise<any>[] = [];
  const startMs = Date.now();

  for (let i = 0; i < CONCURRENT_USERS; i++) {
    const isSearch = i % 2 === 0;
    const reqPromise = isSearch
      ? axios.get(`${API_BASE}/search?city=Mumbai`, { headers: { Authorization: `Bearer ${tokenA}` } })
      : axios.get(`${API_BASE}/search/recommended`, { headers: { Authorization: `Bearer ${tokenB}` } });
    requests.push(reqPromise);
  }

  const results = await Promise.allSettled(requests);
  const totalDuration = Date.now() - startMs;
  const fulfilledCount = results.filter((r) => r.status === 'fulfilled').length;
  const rejectedCount = results.filter((r) => r.status === 'rejected').length;

  console.log(`⏱️  Executed ${CONCURRENT_USERS} requests in ${totalDuration} ms`);
  console.log(`✅ Successful Requests: ${fulfilledCount} / ${CONCURRENT_USERS}`);
  console.log(`❌ Failed Requests: ${rejectedCount}`);
  console.log(`📊 Average Request Latency: ${(totalDuration / CONCURRENT_USERS).toFixed(2)} ms/req`);
  console.log(`⚡ Throughput: ${((CONCURRENT_USERS / totalDuration) * 1000).toFixed(1)} req/sec`);

  const loadPassed = fulfilledCount >= 95;

  console.log('\n===========================================================');
  console.log('🏆 FINAL SECURITY & LOAD TEST SUMMARY');
  console.log('===========================================================');
  console.log(`Mass Assignment Protection : ${massAssignPassed ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Admin BFLA Authorization  : ${bflaPassed ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Socket.IO Room Privacy     : ${socketPassed ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Contact Data Isolation     : ${privacyPassed ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`100 User Load Benchmark    : ${loadPassed ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log('===========================================================\n');
}

runSecurityAndLoadTests().catch((err) => {
  console.error('❌ Security & Load Test Script Error:', err.message);
});
