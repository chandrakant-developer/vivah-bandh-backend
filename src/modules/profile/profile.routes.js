import express from 'express';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { profileController } from './profile.controller.js';

const router = express.Router();

router.get('/me', authenticate, profileController);

export default router;
