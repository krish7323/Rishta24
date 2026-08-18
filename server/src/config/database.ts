import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './env';
import { logger } from '../utils/logger';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.warn(`Standalone MongoDB connection unavailable (${error.message}). Starting embedded MongoMemoryServer...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      logger.info(`Embedded In-Memory MongoDB Connected successfully at ${uri}`);
    } catch (memErr: any) {
      logger.error(`Embedded MongoDB Connection Error: ${memErr.message}`);
      throw memErr;
    }
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
  });
};

