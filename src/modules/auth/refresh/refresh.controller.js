import logger from '../../../logger/logger.js';

import { refreshService } from './refresh.service.js';

import { REFRESH_ERRORS } from './refresh.errors.js';
import { AUTH_CONFIG } from '../../../config/auth.config.js';

export const refreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[AUTH_CONFIG.REFRESH_TOKEN_COOKIE_NAME];

    const response = await refreshService(refreshToken);

    res.cookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE_NAME, response.accessToken, {
      httpOnly: true,
      secure: AUTH_CONFIG.IS_COOKIE_SECURE,
      sameSite: 'lax',
      maxAge: AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: response.user,
    });
  } catch (error) {
    if (error?.message === REFRESH_ERRORS.INVALID_REFRESH_TOKEN) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    if (error?.message === REFRESH_ERRORS.REFRESH_TOKEN_REVOKED) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked',
      });
    }

    if (error?.message === REFRESH_ERRORS.REFRESH_TOKEN_EXPIRED) {
      return res.status(401).json({
        success: false,
        message: 'Expired refresh token',
      });
    }

    if (error?.message === REFRESH_ERRORS.USER_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.error({ err: error }, 'Refresh token error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
