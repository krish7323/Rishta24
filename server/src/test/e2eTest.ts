import axios from 'axios';
import { io as socketClient } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_BASE = 'http://localhost:5000';

async function runE2ETest() {
  console.log('🚀 STARTING RISHTA24 END-TO-END TWO-ACCOUNT VERIFICATION TEST...');

  // 1. REGISTER ACCOUNT A & ACCOUNT B
  console.log('\n--- 1. Registering Real Test Accounts ---');
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

  let tokenA: string = '';
  let tokenB: string = '';
  let userAId: string = '';
  let userBId: string = '';

  try {
    const resA = await axios.post(`${API_BASE}/auth/register`, userAData);
    tokenA = resA.data.data.accessToken;
    userAId = resA.data.data.user.id;
    console.log('✅ Account A Registered Successfully:', userAId);
  } catch (err: any) {
    if (err.response?.data?.code === 'USER_EXISTS') {
      const loginA = await axios.post(`${API_BASE}/auth/login`, { identifier: 'userA@test.local', password: 'Password123!' });
      tokenA = loginA.data.data.accessToken;
      userAId = loginA.data.data.user.id;
      console.log('ℹ️ Account A Logged In:', userAId);
    } else {
      throw err;
    }
  }

  try {
    const resB = await axios.post(`${API_BASE}/auth/register`, userBData);
    tokenB = resB.data.data.accessToken;
    userBId = resB.data.data.user.id;
    console.log('✅ Account B Registered Successfully:', userBId);
  } catch (err: any) {
    if (err.response?.data?.code === 'USER_EXISTS') {
      const loginB = await axios.post(`${API_BASE}/auth/login`, { identifier: 'userB@test.local', password: 'Password123!' });
      tokenB = loginB.data.data.accessToken;
      userBId = loginB.data.data.user.id;
      console.log('ℹ️ Account B Logged In:', userBId);
    } else {
      throw err;
    }
  }

  // 2. SEARCH & VIEW PROFILE
  console.log('\n--- 2. Account A Searches & Views Account B Profile ---');
  const viewRes = await axios.get(`${API_BASE}/profiles/${userBId}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  console.log('✅ Account A viewed Account B profile. Calculated Compatibility:', viewRes.data.data.compatibility?.overallScore + '%');

  // 3. SEND INTEREST & ACCEPT
  console.log('\n--- 3. Account A Sends Interest -> Account B Accepts ---');
  const interestRes = await axios.post(
    `${API_BASE}/interests/send`,
    { receiverId: userBId, message: 'Namaste! Would love to connect.' },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );
  const interestId = interestRes.data.data.interest._id;
  console.log('✅ Interest Sent. ID:', interestId);

  const acceptRes = await axios.post(
    `${API_BASE}/interests/respond`,
    { interestId, action: 'ACCEPT' },
    { headers: { Authorization: `Bearer ${tokenB}` } }
  );
  console.log('✅ Account B Accepted Interest. Mutual Match Created!');

  // 4. REAL-TIME SOCKET CHAT
  console.log('\n--- 4. Real-Time Socket.IO 1-on-1 Chat Exchange ---');
  const socketA = socketClient(SOCKET_BASE, { auth: { token: tokenA } });
  const socketB = socketClient(SOCKET_BASE, { auth: { token: tokenB } });

  await new Promise<void>((resolve, reject) => {
    let messageReceivedByB = false;
    let replyReceivedByA = false;
    let started = false;

    socketB.on('new_message', (data: any) => {
      console.log('📩 Socket B received message from A:', data.message.text);
      messageReceivedByB = true;

      // Account B sends reply via Socket
      socketB.emit('send_message', {
        receiverId: userAId,
        text: 'Hello Aarav! Glad to connect with you.',
        messageType: 'TEXT',
      });
    });

    socketA.on('new_message', (data: any) => {
      console.log('📩 Socket A received reply from B:', data.message.text);
      replyReceivedByA = true;

      if (messageReceivedByB && replyReceivedByA) {
        socketA.disconnect();
        socketB.disconnect();
        resolve();
      }
    });

    const checkAndStart = () => {
      if (!started && socketA.connected && socketB.connected) {
        started = true;
        console.log('🔌 Both Sockets Connected. Initiating real-time message exchange...');
        socketA.emit('send_message', {
          receiverId: userBId,
          text: 'Hello Ananya! Looking forward to talking with you.',
          messageType: 'TEXT',
        });
      }
    };

    socketA.on('connect', checkAndStart);
    socketB.on('connect', checkAndStart);
    checkAndStart();

    setTimeout(() => {
      if (!messageReceivedByB || !replyReceivedByA) {
        socketA.disconnect();
        socketB.disconnect();
        reject(new Error('Socket message exchange timed out'));
      }
    }, 8000);
  });

  // 5. DATA PERSISTENCE & REFRESH VERIFICATION
  console.log('\n--- 5. Verifying Data Persistence in MongoDB ---');
  const convsA = await axios.get(`${API_BASE}/chats/conversations`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  console.log('✅ Account A Conversations Persisted in DB:', convsA.data.data.length);
  const conversationId = convsA.data.data[0]._id;

  const msgsRes = await axios.get(`${API_BASE}/chats/conversations/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  console.log('✅ Conversation Messages Count in DB:', msgsRes.data.data.length);
  console.log('   Message 1:', msgsRes.data.data[0]?.text);
  console.log('   Message 2:', msgsRes.data.data[1]?.text);

  if (msgsRes.data.data.length >= 2) {
    console.log('\n======================================================');
    console.log('🎉 ALL END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('======================================================\n');
  } else {
    throw new Error('Message persistence verification failed');
  }
}

runE2ETest().catch((err) => {
  console.error('❌ E2E Test Failed:', err.message);
  process.exit(1);
});
