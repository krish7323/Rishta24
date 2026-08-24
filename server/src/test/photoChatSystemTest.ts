import axios from 'axios';
import { io as socketClient } from 'socket.io-client';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_BASE = 'http://localhost:5000';

async function runPhotoChatSystemTest() {
  console.log('===========================================================');
  console.log('📸  RISHTA24 PRODUCTION PHOTO + CHAT SYSTEM E2E TEST SUITE');
  console.log('===========================================================\n');

  // --- STEP 1: AUTHENTICATE / REGISTER TEST USERS ---
  console.log('--- 1. Authenticating Test Accounts (User A, B & C) ---');
  let tokenA = '', userAId = '';
  let tokenB = '', userBId = '';
  let tokenC = '', userCId = '';

  const userAData = {
    email: 'photoA@test.local',
    phone: '9900112201',
    password: 'Password123!',
    firstName: 'Dev',
    lastName: 'Sharma',
    gender: 'MALE',
    dateOfBirth: '1994-04-10',
    motherTongue: 'Hindi',
    religion: 'Hindu',
    community: 'Brahmin',
    city: 'Mumbai',
    state: 'Maharashtra',
    educationLevel: 'Master',
    degree: 'MS Computer Science',
    occupation: 'Senior Engineer',
  };

  const userBData = {
    email: 'photoB@test.local',
    phone: '9900112202',
    password: 'Password123!',
    firstName: 'Riya',
    lastName: 'Verma',
    gender: 'FEMALE',
    dateOfBirth: '1996-06-15',
    motherTongue: 'Hindi',
    religion: 'Hindu',
    community: 'Khatri',
    city: 'Delhi',
    state: 'Delhi',
    educationLevel: 'Master',
    degree: 'MBA Marketing',
    occupation: 'Product Manager',
  };

  const userCData = {
    email: 'photoC@test.local',
    phone: '9900112203',
    password: 'Password123!',
    firstName: 'Karan',
    lastName: 'Mehta',
    gender: 'MALE',
    dateOfBirth: '1993-01-20',
    motherTongue: 'Gujarati',
    religion: 'Hindu',
    community: 'Vaishnav',
    city: 'Ahmedabad',
    state: 'Gujarat',
    educationLevel: 'Bachelor',
    degree: 'B.Tech IT',
    occupation: 'DevOps Architect',
  };

  try {
    const resA = await axios.post(`${API_BASE}/auth/register`, userAData);
    tokenA = resA.data.data.accessToken;
    userAId = resA.data.data.user.id;
  } catch (err) {
    const loginA = await axios.post(`${API_BASE}/auth/login`, { identifier: 'photoA@test.local', password: 'Password123!' });
    tokenA = loginA.data.data.accessToken;
    userAId = loginA.data.data.user.id;
  }

  try {
    const resB = await axios.post(`${API_BASE}/auth/register`, userBData);
    tokenB = resB.data.data.accessToken;
    userBId = resB.data.data.user.id;
  } catch (err) {
    const loginB = await axios.post(`${API_BASE}/auth/login`, { identifier: 'photoB@test.local', password: 'Password123!' });
    tokenB = loginB.data.data.accessToken;
    userBId = loginB.data.data.user.id;
  }

  try {
    const resC = await axios.post(`${API_BASE}/auth/register`, userCData);
    tokenC = resC.data.data.accessToken;
    userCId = resC.data.data.user.id;
  } catch (err) {
    const loginC = await axios.post(`${API_BASE}/auth/login`, { identifier: 'photoC@test.local', password: 'Password123!' });
    tokenC = loginC.data.data.accessToken;
    userCId = loginC.data.data.user.id;
  }

  console.log(`✅ Authenticated User A (${userAId}), User B (${userBId}) & User C (${userCId})\n`);

  // --- SYSTEM A: PROFILE PHOTO UPLOAD, PRIMARY & DELETION ---
  console.log('--- SYSTEM A: Profile Photo System Verification ---');
  
  // 1. Upload Photo 1
  const photo1Res = await axios.post(
    `${API_BASE}/profiles/photos`,
    { photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );
  const photosAfterUpload1 = photo1Res.data.data.photos;
  const photo1Id = String(photosAfterUpload1[photosAfterUpload1.length - 1]._id || photosAfterUpload1[photosAfterUpload1.length - 1].id);
  console.log(`✅ Uploaded Photo #1 (${photo1Id}) as primary.`);

  // 2. Upload Photo 2
  const photo2Res = await axios.post(
    `${API_BASE}/profiles/photos`,
    { photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );
  const photosAfterUpload2 = photo2Res.data.data.photos;
  const photo2Id = String(photosAfterUpload2[photosAfterUpload2.length - 1]._id || photosAfterUpload2[photosAfterUpload2.length - 1].id);
  console.log(`✅ Uploaded Photo #2 (${photo2Id}).`);

  // 3. Set Photo 2 as Primary
  const setPrimaryRes = await axios.put(
    `${API_BASE}/profiles/photos/${photo2Id}/primary`,
    {},
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );
  const updatedAvatar = setPrimaryRes.data.data.avatar;
  const isPrimarySet = updatedAvatar === 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400';
  console.log(isPrimarySet ? '✅ PASS: Set Primary Photo verified! Avatar updated.' : '❌ FAIL: Primary photo setting failed.');

  // 4. Unauthorized Photo Deletion Check (User C trying to delete User A's photo)
  let unauthDeleteBlocked = false;
  try {
    await axios.delete(`${API_BASE}/profiles/photos/${photo1Id}`, {
      headers: { Authorization: `Bearer ${tokenC}` },
    });
    console.log('❌ FAIL: User C was able to delete User A photo!');
  } catch (err: any) {
    if (err.response?.status === 404) {
      unauthDeleteBlocked = true;
      console.log('✅ PASS: Ownership Check verified! User C cannot delete User A photo (404/Forbidden).');
    }
  }

  // 5. Authorized Photo Deletion (User A deleting photo #1)
  const deleteRes = await axios.delete(`${API_BASE}/profiles/photos/${photo1Id}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const photosAfterDelete = deleteRes.data.data.photos;
  const photoDeletedPassed = !photosAfterDelete.some(
    (p: any) => String(p._id || p.id) === String(photo1Id)
  );
  console.log(photoDeletedPassed ? '✅ PASS: Photo deletion verified! Target photo removed.' : '❌ FAIL: Photo deletion failed.');

  // --- SYSTEM B: CHAT ATTACHMENT, MESSAGING, SOCKET DELIVERY & AUTHORIZATION ---
  console.log('\n--- SYSTEM B: Chat Image Attachment & Real-Time Synchronization ---');

  // 1. Send Text & Image Messages from User A to User B
  const imageAttachmentUrl = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400';
  const sendMsgRes = await axios.post(
    `${API_BASE}/chats/messages`,
    {
      receiverId: userBId,
      text: 'Here is the family portrait we spoke about! 📸',
      mediaUrl: imageAttachmentUrl,
      messageType: 'IMAGE',
    },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );

  const conversationId = sendMsgRes.data.data.conversationId;
  const messageId = sendMsgRes.data.data.message._id;
  console.log(`✅ Persisted Image Message (${messageId}) in Conversation (${conversationId}).`);

  // 2. Fetch Chat History for User B
  const bHistoryRes = await axios.get(`${API_BASE}/chats/conversations/${conversationId}/messages`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const messagesList = bHistoryRes.data.data;
  const hasImageMsg = messagesList.some(
    (m: any) => m._id === messageId && m.mediaUrl === imageAttachmentUrl && m.messageType === 'IMAGE'
  );
  console.log(hasImageMsg ? '✅ PASS: Chat image message fetched & verified in User B history!' : '❌ FAIL: Chat image message missing.');

  // 3. Unauthorized Conversation History Access (User C trying to read Conversation A-B)
  let unauthChatBlocked = false;
  try {
    await axios.get(`${API_BASE}/chats/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${tokenC}` },
    });
    console.log('❌ FAIL: User C accessed User A-B conversation history!');
  } catch (err: any) {
    if (err.response?.status === 404 || err.response?.status === 403) {
      unauthChatBlocked = true;
      console.log('✅ PASS: Conversation Access Control verified! User C denied access (404/403).');
    }
  }

  // --- SUMMARY OF ALL ACCEPTANCE TESTS ---
  console.log('\n===========================================================');
  console.log('🏆 PHOTO & CHAT SYSTEM PRODUCTION ACCEPTANCE SCORECARD');
  console.log('===========================================================');
  console.log(`Profile Photo Upload & Primary Set : ${isPrimarySet ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Profile Photo Ownership Check      : ${unauthDeleteBlocked ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Profile Photo Deletion            : ${photoDeletedPassed ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Chat Image Attachment Persisted   : ${hasImageMsg ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log(`Chat Access Control & Isolation   : ${unauthChatBlocked ? 'PASS 🟢' : 'FAIL 🔴'}`);
  console.log('===========================================================\n');
}

runPhotoChatSystemTest().catch((err) => {
  console.error('❌ Photo & Chat System Test Error:', err.message);
});
