import express from 'express';

import { registerUserController } from './register/register.controller.js';
import { validateRegisterUser } from './register/register.validator.js';

const router = express.Router();

router.post('/register', validateRegisterUser, registerUserController);

export default router;
