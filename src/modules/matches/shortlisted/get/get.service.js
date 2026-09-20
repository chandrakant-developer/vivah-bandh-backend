import { getShortlist } from './get.repository.js';
import { calculateAge, sortMatches, parseArrayFilter } from '../../../matches/matches.utils.js';
import { SHORTLISTED_ERRORS } from '../shortlisted.errors.js';
import { calculateMatchScore } from '../../score.service.js';
import Profile from '../../../../models/profile.model.js';
import { MINIMUM_MATCH_SCORE } from '../../matches.constants.js';

export const getShortlistsService = async (userId, filters, sortBy, search, page, limit) => {
  if (!userId) {
    throw new Error(SHORTLISTED_ERRORS.USER_ID_REQUIRED.code);
  }

  const currentPage = Math.max(Number(page) || 1, 1);

  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const skip = (currentPage - 1) * pageSize;

  const findProfileByUserId = async (userId) => {
    return Profile.findOne({
      userId,
    }).lean();
  };

  const currentProfile = await findProfileByUserId(userId);

  if (!currentProfile) {
    throw new Error(SHORTLISTED_ERRORS.PROFILE_NOT_FOUND.code);
  }

  if (!currentProfile.profileCompleted) {
    throw new Error(SHORTLISTED_ERRORS.INCOMPLETE_PROFILE.code);
  }

  if (currentProfile.status !== 'active') {
    throw new Error(SHORTLISTED_ERRORS.INACTIVE_PROFILE.code);
  }

  const candidates = await getShortlist({
    userId,

    filters: {
      ...filters,
      religion: parseArrayFilter(filters.religion),
      location: parseArrayFilter(filters.location),
      community: parseArrayFilter(filters.community),
      education: parseArrayFilter(filters.education),
    },

    search,
  });

  const matches = candidates
    .map((shortlist) => {
      const profile = shortlist.candidate;

      const matchPercentage = calculateMatchScore(currentProfile, profile);

      return {
        userId: profile.userId,
        name: profile.name,
        age: calculateAge(profile.dob),
        height: profile.height,
        religion: profile.religion,
        maritalStatus: profile.maritalStatus,
        profilePhotos: profile.profilePhotos,
        occupation: profile.occupation,

        location: {
          city: profile.location?.city || null,
          state: profile.location?.state || null,
        },

        matchPercentage,

        shortlistedAt: profile.shortlistedAt,

        isShortlisted: true,
      };
    })
    .filter((profile) => profile.matchPercentage >= MINIMUM_MATCH_SCORE);

  sortMatches(matches, sortBy);

  const total = matches.length;

  const paginatedShortlist = matches.slice(skip, skip + pageSize);

  const totalPages = Math.ceil(total / pageSize);

  return {
    shortlist: paginatedShortlist,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
};
