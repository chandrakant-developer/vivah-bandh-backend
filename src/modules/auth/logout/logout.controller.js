import logger from '../../../logger/logger.js';

import { AUTH_CONFIG } from '../../../config/auth.config.js';

import { logoutService } from './logout.service.js';

export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[AUTH_CONFIG.REFRESH_TOKEN_COOKIE_NAME];

    await logoutService(refreshToken);

    res.clearCookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_CONFIG.IS_COOKIE_SECURE,
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie(AUTH_CONFIG.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: AUTH_CONFIG.IS_COOKIE_SECURE,
      sameSite: 'lax',
      path: '/api/auth',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error({ err: error }, 'Logout error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
