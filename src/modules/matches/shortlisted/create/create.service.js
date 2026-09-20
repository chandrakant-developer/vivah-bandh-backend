import { createShortlist } from './create.repository.js';
import { SHORTLISTED_ERRORS } from '../shortlisted.errors.js';
import logger from '../../../../logger/logger.js';

export const createShortlistService = async (userId, candidateUserId) => {
  if (!userId) {
    throw new Error('USER_ID_REQUIRED');
  }

  if (!candidateUserId) {
    throw new Error('CANDIDATE_USER_ID_REQUIRED');
  }

  if (userId === candidateUserId) {
    throw new Error(SHORTLISTED_ERRORS.CANNOT_SHORTLIST_SELF.code);
  }

  try {
    const response = await createShortlist({
      userId,
      shortlistedUserId: candidateUserId,
    });

    return {
      data: {
        userId: response.userId,
        shortlistedUserId: response.shortlistedUserId,
      },
    };
  } catch (error) {
    if (error?.code === 11000) {
      logger.warn('Profile already shortlisted');

      throw new Error(SHORTLISTED_ERRORS.ALREADY_SHORTLISTED.code, { cause: error });
    }

    throw error;
  }
};
