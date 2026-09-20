import { removeShortlistService } from './remove.service.js';
import { SHORTLISTED_ERRORS } from '../shortlisted.errors.js';
import logger from '../../../../logger/logger.js';

export const removeShortlistController = async (req, res) => {
  try {
    const userId = req.userId;
    const { candidateUserId } = req.params;

    const response = await removeShortlistService(userId, candidateUserId);

    return res.status(200).json({
      success: true,
      message: 'Profile removed from shortlist successfully',
      data: response.data,
    });
  } catch (error) {
    if (error?.message === SHORTLISTED_ERRORS.USER_ID_REQUIRED.code) {
      return res.status(409).json({
        success: false,
        message: SHORTLISTED_ERRORS.USER_ID_REQUIRED.message,
      });
    }

    if (error?.message === SHORTLISTED_ERRORS.CANDIDATE_USER_ID_REQUIRED.code) {
      return res.status(409).json({
        success: false,
        message: SHORTLISTED_ERRORS.CANDIDATE_USER_ID_REQUIRED.message,
      });
    }

    if (error?.message === SHORTLISTED_ERRORS.SHORTLIST_NOT_FOUND.code) {
      return res.status(404).json({
        success: false,
        message: SHORTLISTED_ERRORS.SHORTLIST_NOT_FOUND.message,
      });
    }

    logger.error({ err: error }, 'Failed to remove profile from shortlist');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};
