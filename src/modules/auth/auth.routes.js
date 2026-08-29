import express from 'express';

import { registerUserController } from './register/register.controller.js';
import { validateRegisterUser } from './register/register.validator.js';

import { loginController } from './login/login.controller.js';

const router = express.Router();

router.post('/register', validateRegisterUser, registerUserController);
router.post('/login', loginController);

export default router;
