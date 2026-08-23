import { registerUserService } from './register.service.js';
import { REGISTER_ERRORS } from './register.errors.js';
import logger from '../../../logger/logger.js';

export const registerUserController = async (req, res) => {
  try {
    const response = await registerUserService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Profile registered successfully',
      data: response,
    });
  } catch (error) {
    if (error && error.message === REGISTER_ERRORS.EMAIL_EXISTS) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    if (error && error.message === REGISTER_ERRORS.MOBILE_EXISTS) {
      return res.status(409).json({
        success: false,
        message: 'Mobile number already exists',
      });
    }

    logger.error({ error }, 'Register user error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};
