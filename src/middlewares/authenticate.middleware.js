import jwt from 'jsonwebtoken';

import logger from '../logger/logger.js';

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      });
    }

    req.userId = payload.sub;

    next();
  } catch (error) {
    logger.warn({ err: error }, 'Access token verification failed');

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};
