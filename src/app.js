import express from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './modules/profile/profile.routes.js';
import loggerMiddleware from './middlewares/logger.middleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(loggerMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Server is up and running!!',
  });
});

export default app;
