import mongoose from 'mongoose';

import logger from '../logger/logger.js';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);

    logger.info('✅ Database connected successfully!!');
  } catch (error) {
    logger.error({ error }, '❌ Database connection failed');
    process.exit(1);
  }
};

export default connectDB;
