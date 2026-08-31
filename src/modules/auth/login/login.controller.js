import crypto from 'crypto';

import logger from '../../../logger/logger.js';

import { loginService } from './login.service.js';

import { LOGIN_ERRORS } from './login.errors.js';
import { AUTH_CONFIG } from '../../../config/auth.config.js';

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    let deviceId = req.cookies?.deviceId;

    if (!deviceId) {
      deviceId = crypto.randomUUID();
    }

    const userAgent = req.get('user-agent');

    const ipAddress = req.ip;

    const response = await loginService({
      username,
      password,
      deviceId,
      userAgent,
      ipAddress,
    });

    res.cookie(AUTH_CONFIG.ACCESS_TOKEN_COOKIE_NAME, response.accessToken, {
      httpOnly: true,
      secure: AUTH_CONFIG.IS_COOKIE_SECURE,
      sameSite: 'lax',
      maxAge: AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE,
      path: '/',
    });

    res.cookie(AUTH_CONFIG.REFRESH_TOKEN_COOKIE_NAME, response.refreshToken, {
      httpOnly: true,
      secure: AUTH_CONFIG.IS_COOKIE_SECURE,
      sameSite: 'lax',
      maxAge: AUTH_CONFIG.REFRESH_TOKEN_MAX_AGE,
      path: '/api/auth',
    });

    res.cookie(AUTH_CONFIG.DEVICE_ID_COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: AUTH_CONFIG.IS_COOKIE_SECURE,
      sameSite: 'lax',
      maxAge: AUTH_CONFIG.DEVICE_ID_MAX_AGE,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successfully!',
      data: response.user,
    });
  } catch (error) {
    if (error && error.message === LOGIN_ERRORS.INVALID_CREDENTIALS) {
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
