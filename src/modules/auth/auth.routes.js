import express from 'express';

import { validate } from '../../middlewares/validate.middleware.js';
import { loginRateLimiter } from '../../middlewares/ratelimiter.middleware.js';

import { loginSchema } from './login/login.validation.js';
import { registerSchema } from './register/register.validation.js';

import { registerUserController } from './register/register.controller.js';
import { loginController } from './login/login.controller.js';
import { refreshController } from './refresh/refresh.controller.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUserController);
router.post('/login', loginRateLimiter, validate(loginSchema), loginController);
router.post('/refresh', refreshController);

export default router;
