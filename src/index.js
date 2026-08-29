import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.config.js';
import logger from './logger/logger.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(
        {
          port: PORT,
          environment: process.env.NODE_ENV || 'development',
        },
        '🚀 Server started successfully'
      );
    });
  } catch (error) {
    logger.error({ error }, '❌ Server startup failed');
    process.exit(1);
  }
};

startServer();
