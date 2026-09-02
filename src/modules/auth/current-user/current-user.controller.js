import { currentUserService } from './current-user.service.js';

import { CURRENT_USER_ERRORS } from './current-user.error.js';

import logger from '../../../logger/logger.js';

export const currentUserController = async (req, res) => {
  try {
    const response = await currentUserService(req.userId);

    res.status(200).json({
      success: true,
      message: 'User details fetched successfully',
      data: response,
    });
  } catch (error) {
    if (error?.message === CURRENT_USER_ERRORS.USER_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.error({ err: error }, 'User details fetch error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
