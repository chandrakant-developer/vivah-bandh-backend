import { getShortlistsService } from './get.service.js';
import { SHORTLISTED_ERRORS } from '../shortlisted.errors.js';
import logger from '../../../../logger/logger.js';

export const getShortlistsController = async (req, res) => {
  try {
    const { sortBy, search, page, limit, ...filters } = req.query;

    const userId = req.userId;

    const response = await getShortlistsService(userId, filters, sortBy, search, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Shortlisted profiles fetched successfully',
      data: response,
    });
  } catch (error) {
    if (error?.message === SHORTLISTED_ERRORS.USER_ID_REQUIRED.code) {
      return res.status(409).json({
        success: false,
        message: SHORTLISTED_ERRORS.USER_ID_REQUIRED.message,
      });
    }

    logger.error({ err: error }, 'Failed to fetch shortlisted profiles');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};
