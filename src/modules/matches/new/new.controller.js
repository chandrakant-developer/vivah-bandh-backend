import { getNewMatchesService } from './new.service.js';
import { MATCHES_ERRORS } from '../matches.errors.js';
import logger from '../../../logger/logger.js';

export const getNewMatchesController = async (req, res) => {
  try {
    const { sortBy, search, page, limit, ...filters } = req.query;

    const userId = req.userId;

    const response = await getNewMatchesService({
      userId,
      filters,
      sortBy,
      search,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: 'New matches fetched successfully',
      data: response,
    });
  } catch (error) {
    if (error?.message === MATCHES_ERRORS.PROFILE_NOT_FOUND.code) {
      return res.status(404).json({
        success: false,
        message: MATCHES_ERRORS.PROFILE_NOT_FOUND.message,
      });
    }

    if (error?.message === MATCHES_ERRORS.INCOMPLETE_PROFILE.code) {
      return res.status(401).json({
        success: false,
        message: MATCHES_ERRORS.INCOMPLETE_PROFILE.message,
      });
    }

    if (error?.message === MATCHES_ERRORS.INACTIVE_PROFILE.code) {
      return res.status(401).json({
        success: false,
        message: MATCHES_ERRORS.INACTIVE_PROFILE.message,
      });
    }

    if (error?.message === MATCHES_ERRORS.PREFERRED_GENDER_NOT_FOUND.code) {
      return res.status(404).json({
        success: false,
        message: MATCHES_ERRORS.PREFERRED_GENDER_NOT_FOUND.message,
      });
    }

    logger.error({ err: error }, 'Failed to fetch new matches');

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};
