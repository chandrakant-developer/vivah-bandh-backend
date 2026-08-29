import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)

app.use(loggerMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Server is up and running!!',
  });
});

export default app;
