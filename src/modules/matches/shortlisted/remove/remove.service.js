import { removeShortlist } from './remove.repository.js';
import { SHORTLISTED_ERRORS } from '../shortlisted.errors.js';

export const removeShortlistService = async (userId, candidateUserId) => {
  if (!userId) {
    throw new Error(SHORTLISTED_ERRORS.USER_ID_REQUIRED.code);
  }

  if (!candidateUserId) {
    throw new Error(SHORTLISTED_ERRORS.CANDIDATE_USER_ID_REQUIRED.code);
  }

  const response = await removeShortlist({
    userId,
    shortlistedUserId: candidateUserId,
  });

  if (!response) {
    throw new Error(SHORTLISTED_ERRORS.SHORTLIST_NOT_FOUND.code);
  }

  return {
    data: {
      userId: response.userId,
      shortlistedUserId: response.shortlistedUserId,
    },
  };
};
