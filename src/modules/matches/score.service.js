import {
  calculateAge,
  calculatePercentage,
  isAgeMatched,
  isPreferenceMatched,
} from './matches.utils.js';

import { MATCH_SCORE_WEIGHTS } from './matches.constants.js';

const calculatePreferenceScore = (profileOwner, candidate) => {
  const preference = profileOwner.partnerPreference || {};

  let score = 0;
  let maxScore = 0;

  const candidateAge = calculateAge(candidate.dob);
  const ageMatched = isAgeMatched(candidateAge, preference.minAge, preference.maxAge);

  if (ageMatched !== null) {
    maxScore += MATCH_SCORE_WEIGHTS.AGE;

    if (ageMatched) {
      score += MATCH_SCORE_WEIGHTS.AGE;
    }
  }

  const religionMatched = isPreferenceMatched(preference.religion, candidate.religion);

  if (religionMatched !== null) {
    maxScore += MATCH_SCORE_WEIGHTS.RELIGION;

    if (religionMatched) {
      score += MATCH_SCORE_WEIGHTS.RELIGION;
    }
  }

  const communityMatched = isPreferenceMatched(preference.community, candidate.community);

  if (communityMatched !== null) {
    maxScore += MATCH_SCORE_WEIGHTS.COMMUNITY;

    if (communityMatched) {
      score += MATCH_SCORE_WEIGHTS.COMMUNITY;
    }
  }

  const educationMatched = isPreferenceMatched(preference.education, candidate.education);

  if (educationMatched !== null) {
    maxScore += MATCH_SCORE_WEIGHTS.EDUCATION;

    if (educationMatched) {
      score += MATCH_SCORE_WEIGHTS.EDUCATION;
    }
  }

  const occupationMatched = isPreferenceMatched(preference.occupation, candidate.occupation);

  if (occupationMatched !== null) {
    maxScore += MATCH_SCORE_WEIGHTS.OCCUPATION;

    if (occupationMatched) {
      score += MATCH_SCORE_WEIGHTS.OCCUPATION;
    }
  }

  return {
    score,
    maxScore,

    percentage: calculatePercentage(score, maxScore),
  };
};

export const calculateMatchScore = (currentProfile, candidateProfile) => {
  const currentUserScore = calculatePreferenceScore(currentProfile, candidateProfile);

  const candidateScore = calculatePreferenceScore(candidateProfile, currentProfile);

  let matchPercentage = 0;

  if (currentUserScore.maxScore > 0 && candidateScore.maxScore > 0) {
    matchPercentage = currentUserScore.percentage * 0.6 + candidateScore.percentage * 0.4;
  } else if (currentUserScore.maxScore > 0) {
    matchPercentage = currentUserScore.percentage;
  } else if (candidateScore.maxScore > 0) {
    matchPercentage = candidateScore.percentage;
  }

  return Math.round(matchPercentage);
};
