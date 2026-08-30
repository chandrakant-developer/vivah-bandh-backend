import { profileService } from './profile.service.js';
import { PROFILE_ERRORS } from './profile.errors.js';
import logger from '../../logger/logger.js';

export const profileController = async (req, res) => {
  try {
    const response = await profileService(req.userId);

    return res.status(200).json({
      success: true,
      message: 'Profile details fetched successfully',
      data: response,
    });
  } catch (error) {
    if (error?.message === PROFILE_ERRORS.INVALID_USER_ID) {
      return res.status(401).json({
        success: false,
        message: 'User ID is not valid',
      });
    }

    if (error?.message === PROFILE_ERRORS.PROFILE_NOT_FOUND) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    logger.error({ err: error }, 'Profile fetch error');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
