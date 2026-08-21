import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    message: '🚀 Server is up and running!!',
  });
});

const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌Server startup failed:', error.message);
    } else {
      console.error('❌Server startup failed:', error);
    }

    process.exit(1);
  }
};

startServer();
