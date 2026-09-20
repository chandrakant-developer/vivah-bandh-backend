import { createShortlistService } from './create.service.js';
import { SHORTLISTED_ERRORS } from '../shortlisted.errors.js';
import logger from '../../../../logger/logger.js';

export const createShortlistController = async (req, res) => {
  try {
    const userId = req.userId;
    const { candidateUserId } = req.params;

    const response = await createShortlistService(userId, candidateUserId);

    return res.status(201).json({
      success: true,
      message: 'Profile shortlisted successfully',
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

    if (error?.message === SHORTLISTED_ERRORS.CANNOT_SHORTLIST_SELF.code) {
      return res.status(400).json({
        success: false,
        message: SHORTLISTED_ERRORS.CANNOT_SHORTLIST_SELF.message,
      });
    }

    if (error?.message === SHORTLISTED_ERRORS.ALREADY_SHORTLISTED.code) {
      return res.status(409).json({
        success: false,
        message: SHORTLISTED_ERRORS.ALREADY_SHORTLISTED.message,
      });
    }

    logger.error({ err: error }, 'Failed to create shortlist');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};
