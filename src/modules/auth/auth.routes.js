import express from 'express';

import { registerUserController } from './register/register.controller.js';
import { validateRegisterUser } from './register/register.validator.js';

import { loginController } from './login/login.controller.js';
import { refreshController } from './refresh/refresh.controller.js';

const router = express.Router();

router.post('/register', validateRegisterUser, registerUserController);
router.post('/login', loginController);
router.post('/refresh', refreshController);

export default router;
