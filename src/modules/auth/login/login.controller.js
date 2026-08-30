import { loginService } from './login.service.js';
import { LOGIN_ERROS } from './login.errors.js';
import logger from '../../../logger/logger.js';

export const loginController = async (req, res) => {
  try {
    const response = await loginService(req.body);

    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successfully!',
      data: response.user,
    });
  } catch (error) {
    if (error && error.message === LOGIN_ERROS.INVALID_CREDENTIALS) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    logger.error({ err: error }, 'Login user error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
