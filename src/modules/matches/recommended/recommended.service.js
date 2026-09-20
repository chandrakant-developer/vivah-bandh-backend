import { MATCHES_ERRORS } from '../matches.errors.js';
import { calculateMatchScore } from '../score.service.js';

import { findProfileByUserId, findRecommendedCandidates } from './recommended.repository.js';
import { getShortlistedUserIds } from '../shortlisted.repository.js';

import {
  calculateAge,
  getPreferredGender,
  parseArrayFilter,
  sortMatches,
} from '../matches.utils.js';
import { MINIMUM_MATCH_SCORE } from '../matches.constants.js';

export const getRecommendedMatchesService = async ({
  userId,
  filters,
  sortBy,
  search,
  page,
  limit,
}) => {
  const currentPage = Math.max(Number(page) || 1, 1);

  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const skip = (currentPage - 1) * pageSize;

  const currentProfile = await findProfileByUserId(userId);

  if (!currentProfile) {
    throw new Error(MATCHES_ERRORS.PROFILE_NOT_FOUND.code);
  }

  if (!currentProfile.profileCompleted) {
    throw new Error(MATCHES_ERRORS.INCOMPLETE_PROFILE.code);
  }

  if (currentProfile.status !== 'active') {
    throw new Error(MATCHES_ERRORS.INACTIVE_PROFILE.code);
  }

  const preferredGender = getPreferredGender(currentProfile.gender);

  if (!preferredGender) {
    throw new Error(MATCHES_ERRORS.PREFERRED_GENDER_NOT_FOUND.code);
  }

  const candidates = await findRecommendedCandidates({
    currentUserId: userId,
    preferredGender,

    filters: {
      ...filters,
      religion: parseArrayFilter(filters.religion),
      location: parseArrayFilter(filters.location),
      community: parseArrayFilter(filters.community),
      education: parseArrayFilter(filters.education),
    },

    search,
  });

  const shortlistedUserIds = await getShortlistedUserIds(userId);
  const shortlistedUserIdSet = new Set(shortlistedUserIds);

  const matches = candidates
    .map((candidate) => {
      const matchPercentage = calculateMatchScore(currentProfile, candidate);

      return {
        userId: candidate.userId,
        name: candidate.name,
        age: calculateAge(candidate.dob),
        height: candidate.height,
        religion: candidate.religion,
        maritalStatus: candidate.maritalStatus,
        profilePhotos: candidate.profilePhotos,
        occupation: candidate.occupation,

        location: {
          city: candidate.location?.city || null,
          state: candidate.location?.state || null,
        },

        createdAt: candidate.createdAt,
        updatedAt: candidate.updatedAt,

        matchPercentage,

        isShortlisted: shortlistedUserIdSet.has(candidate.userId),
      };
    })
    .filter((candidate) => candidate.matchPercentage >= MINIMUM_MATCH_SCORE);

  sortMatches(matches, sortBy);

  const total = matches.length;

  const paginatedMatches = matches.slice(skip, skip + pageSize);

  const totalPages = Math.ceil(total / pageSize);

  return {
    matches: paginatedMatches,
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
