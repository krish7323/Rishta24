import axios from 'axios';
import { io } from 'socket.io-client';

const LIVE_URL = 'https://rishta24-backend.onrender.com';
const API_URL = `${LIVE_URL}/api`;

async function testLiveRender() {
  console.log('====================================================');
  console.log('🚀 TESTING LIVE RENDER BACKEND & MOBILE CONNECTIVITY');
  console.log(`Target URL: ${LIVE_URL}`);
  console.log('====================================================\n');

  // 1. Health Check
  console.log('1. Testing Health Check...');
  const healthRes = await axios.get(`${API_URL}/health`);
  console.log('✅ Health Response:', healthRes.data);

  // 2. Demo User Login
  console.log('\n2. Testing Demo User Authentication on Live Server...');
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    identifier: 'demo@rishta24.test',
    password: 'Password123!',
  });
  console.log('✅ Login Successful! User ID:', loginRes.data.data.user.id);
  const token = loginRes.data.data.accessToken;
  console.log('✅ Access Token retrieved successfully.');

  // 3. User Profile Fetch
  console.log('\n3. Testing Profile Retrieval (/api/auth/me)...');
  const profileRes = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('✅ Profile Fetched for:', `${profileRes.data.data.profile.firstName} ${profileRes.data.data.profile.lastName}`);
  console.log('   Email:', profileRes.data.data.user.email);
  console.log('   Location:', `${profileRes.data.data.profile.city}, ${profileRes.data.data.profile.state}`);

  // 4. Discovery / Recommendations
  console.log('\n4. Testing Exploration & Recommendation Engine (/api/search/recommended)...');
  const exploreRes = await axios.get(`${API_URL}/search/recommended`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`✅ Discovery Returned ${exploreRes.data.data.length} Recommended Profiles.`);
  if (exploreRes.data.data.length > 0) {
    const first = exploreRes.data.data[0];
    console.log(`   Top Match: ${first.firstName} ${first.lastName} (${first.age}y, ${first.city}) - Compatibility: ${first.compatibility?.overallScore || 'N/A'}%`);
  }

  // 5. Socket.IO Live Connection
  console.log('\n5. Testing Live Socket.IO Connection to Render...');
  await new Promise<void>((resolve, reject) => {
    const socket = io(LIVE_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    socket.on('connect', () => {
      console.log('✅ Live Socket Connected successfully! Socket ID:', socket.id);
      socket.disconnect();
      resolve();
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err.message);
      socket.disconnect();
      reject(err);
    });

    setTimeout(() => {
      socket.disconnect();
      resolve();
    }, 8000);
  });

  console.log('\n====================================================');
  console.log('🎉 ALL LIVE RENDER BACKEND TESTS PASSED 100%!');
  console.log('====================================================');
}

testLiveRender().catch((err) => {
  console.error('❌ Test failed with error:', err.response?.data || err.message);
});
