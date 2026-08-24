import mongoose from 'mongoose';
import { ENV } from '../config/env';

async function testAtlas() {
  console.log('Connecting to MongoDB Atlas...');
  console.log('URI:', ENV.MONGO_URI.replace(/:([^@]+)@/, ':****@'));
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Successfully connected to MongoDB Atlas host:', conn.connection.host);
    await mongoose.disconnect();
    console.log('✅ Connection test complete.');
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
  }
}

testAtlas();
